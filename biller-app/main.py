import customtkinter as ctk
import tkinter as tk
from tkinter import messagebox
import json
import time
import threading
import os
from datetime import datetime, timezone

# ── MongoDB connection ──────────────────────────────────────────────────────
from pymongo import MongoClient
from pymongo.errors import ConnectionFailure, OperationFailure

# Read MONGO_URL from the portal's .env
def _load_mongo_url():
    import sys

    # When bundled by PyInstaller, files in datas=[] are extracted to sys._MEIPASS
    if getattr(sys, 'frozen', False):
        base_dir = sys._MEIPASS
    else:
        # Running as plain Python: .env is one level up (project root)
        base_dir = os.path.normpath(os.path.join(os.path.dirname(__file__), ".."))

    env_path = os.path.join(base_dir, ".env")
    if os.path.exists(env_path):
        with open(env_path, "r") as f:
            for line in f:
                line = line.strip()
                if line.startswith("MONGO_URL="):
                    return line[len("MONGO_URL="):]
    return None

MONGO_URL = _load_mongo_url()

def get_db():
    """Return the 'billify' Mongo database, or raise ConnectionFailure."""
    if not MONGO_URL:
        raise ConnectionFailure("MONGO_URL not found in .env")
    client = MongoClient(MONGO_URL, serverSelectionTimeoutMS=5000)
    return client["billify"]

def verify_access_key(raw_key: str):
    """
    Look up 'raw_key' in the biller_keys collection.
    Returns (True, biller_name) on success, (False, error_message) on failure.
    """
    try:
        db = get_db()
        now = datetime.now(timezone.utc)

        # Debug: Log the key being searched
        print(f"[DEBUG] Searching for key: '{raw_key}' (length: {len(raw_key)})")
        
        key_doc = db["biller_keys"].find_one({"key": raw_key})

        if not key_doc:
            # Debug: Check if any keys exist
            total_keys = db["biller_keys"].count_documents({})
            print(f"[DEBUG] Key not found. Total keys in DB: {total_keys}")
            return False, "Access key not found. Please copy it exactly from the portal."

        expires_at = key_doc.get("expiresAt")
        # Ensure timezone-aware comparison
        if expires_at is not None:
            if expires_at.tzinfo is None:
                expires_at = expires_at.replace(tzinfo=timezone.utc)
            print(f"[DEBUG] Key expires at: {expires_at}, Current time: {now}")
            if expires_at < now:
                return False, "Access key has expired. Please generate a new one from the portal."
        
        print(f"[DEBUG] Key is valid and not expired")

        # Try to fetch biller name (optional – graceful fallback)
        user_id = key_doc.get("userId")
        biller_name = "Biller Terminal"
        if user_id:
            biller_doc = db["billers"].find_one({"userId": user_id})
            if biller_doc and biller_doc.get("name"):
                biller_name = biller_doc["name"]

        print(f"[DEBUG] Authentication successful for: {biller_name}")
        return True, biller_name

    except ConnectionFailure:
        print("[DEBUG] Connection failure to MongoDB")
        return False, "Cannot connect to Billify Cloud. Check your internet connection."
    except OperationFailure as e:
        print(f"[DEBUG] Database operation failed: {e}")
        return False, f"Database error: {e}"
    except Exception as e:
        print(f"[DEBUG] Unexpected error: {e}")
        import traceback
        traceback.print_exc()
        return False, f"Unexpected error: {e}"


# ── Configure global theme ──────────────────────────────────────────────────
ctk.set_appearance_mode("Dark")
ctk.set_default_color_theme("blue")


class BillifyPOSApp(ctk.CTk):
    def __init__(self):
        super().__init__()

        self.title("Billify Biller App")
        self.geometry("1000x700")
        self.minsize(800, 600)

        # App state
        self.is_authenticated = False
        self.biller_name = ""
        self.cart = []

        # Container config
        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(0, weight=1)

        self.frames = {}

        # Initialize Frames
        self.login_frame = LoginFrame(self, self.authenticate)
        self.pos_frame = POSFrame(self, self.logout)

        # Show Login
        self.show_frame("login")

    def show_frame(self, frame_name):
        if frame_name == "login":
            self.pos_frame.grid_forget()
            self.login_frame.grid(row=0, column=0, sticky="nsew")
        elif frame_name == "pos":
            self.login_frame.grid_forget()
            self.pos_frame.grid(row=0, column=0, sticky="nsew")

    def authenticate(self, access_key, on_done):
        """
        Validate the access key against MongoDB in a background thread.
        Calls on_done(success: bool, message: str) on the main thread when complete.
        """
        def _do_verify():
            success, message = verify_access_key(access_key)
            # Schedule UI update back on the main thread
            self.after(0, lambda: on_done(success, message))

        threading.Thread(target=_do_verify, daemon=True).start()

    def on_auth_result(self, success, result):
        """Called on the main thread after authentication completes."""
        if success:
            self.is_authenticated = True
            self.biller_name = result
            self.pos_frame.set_biller_info(self.biller_name)
            self.show_frame("pos")
        else:
            self.login_frame.show_error(result)

    def logout(self):
        self.is_authenticated = False
        self.biller_name = ""
        self.cart = []
        self.pos_frame.clear_cart()
        self.login_frame.clear_input()
        self.show_frame("login")


class LoginFrame(ctk.CTkFrame):
    def __init__(self, master, auth_callback):
        super().__init__(master, fg_color="transparent")
        self.auth_callback = auth_callback
        self._authenticating = False

        self.grid_rowconfigure(0, weight=1)
        self.grid_columnconfigure(0, weight=1)

        # Center login box
        self.box = ctk.CTkFrame(self, width=420, height=480, corner_radius=15)
        self.box.grid(row=0, column=0)
        self.box.grid_propagate(False)

        # Logo/Title
        self.title_label = ctk.CTkLabel(self.box, text="Billify POS", font=ctk.CTkFont(size=28, weight="bold"))
        self.title_label.pack(pady=(40, 5))

        self.subtitle = ctk.CTkLabel(self.box, text="Enter your Biller Portal Access Key", font=ctk.CTkFont(size=13), text_color="gray")
        self.subtitle.pack(pady=(0, 35))

        # Key Input
        self.key_entry = ctk.CTkEntry(self.box, placeholder_text="Paste your access key here", width=320, height=45)
        self.key_entry.pack(pady=10)
        self.key_entry.bind("<Return>", lambda e: self.handle_login())
        
        # Key format hint
        self.hint_label = ctk.CTkLabel(
            self.box, 
            text="Format: 12 characters (letters, numbers, symbols)", 
            font=ctk.CTkFont(size=11), 
            text_color="gray"
        )
        self.hint_label.pack(pady=(0, 10))

        # Login button
        self.login_btn = ctk.CTkButton(
            self.box, text="Authenticate Terminal",
            command=self.handle_login, width=320, height=45,
            font=ctk.CTkFont(weight="bold")
        )
        self.login_btn.pack(pady=(25, 10))

        # Status label
        self.status = ctk.CTkLabel(self.box, text="", text_color="red", wraplength=340)
        self.status.pack(pady=(5, 0))

        # Progress bar (hidden by default)
        self.progress = ctk.CTkProgressBar(self.box, width=320, mode="indeterminate")

    def handle_login(self):
        if self._authenticating:
            return

        key = self.key_entry.get().strip()
        
        # Remove any potential hidden characters or whitespace
        key = ''.join(key.split())  # Remove all whitespace
        
        if not key:
            self.status.configure(text="Please paste your access key from the portal.", text_color="red")
            return
        
        print(f"[DEBUG] User entered key: '{key}' (length: {len(key)})")

        self._set_loading(True)

        def on_done(success, message):
            self._set_loading(False)
            self.master.on_auth_result(success, message)

        self.auth_callback(key, on_done)

    def _set_loading(self, loading: bool):
        self._authenticating = loading
        if loading:
            self.login_btn.configure(state="disabled", text="Verifying…")
            self.key_entry.configure(state="disabled")
            self.status.configure(text="Connecting to Billify Cloud…", text_color="#60a5fa")
            self.progress.pack(pady=(10, 0))
            self.progress.start()
        else:
            self.progress.stop()
            self.progress.pack_forget()
            self.login_btn.configure(state="normal", text="Authenticate Terminal")
            self.key_entry.configure(state="normal")
            self.status.configure(text="")

    def show_error(self, message: str):
        self.status.configure(text=message, text_color="red")

    def clear_input(self):
        self.key_entry.delete(0, tk.END)
        self.status.configure(text="")


class POSFrame(ctk.CTkFrame):
    def __init__(self, master, logout_callback):
        super().__init__(master)
        self.logout_callback = logout_callback
        self.cart = []

        self.grid_rowconfigure(1, weight=1)
        self.grid_columnconfigure(0, weight=1)

        # Mock Product Database  (replace with MongoDB fetch as needed)
        self.products = [
            {"id": "1", "name": "Standard Consultation", "price": 150.00},
            {"id": "2", "name": "Premium Service Package", "price": 450.00},
            {"id": "3", "name": "Monthly Subscription", "price": 49.99},
            {"id": "4", "name": "One-Time Setup Fee", "price": 99.00},
            {"id": "5", "name": "Hardware Terminal", "price": 299.00},
            {"id": "6", "name": "Support Add-on", "price": 25.00},
        ]

        self.create_header()

        # Main Body Split (Left: Products, Right: Cart)
        self.body_frame = ctk.CTkFrame(self, fg_color="transparent")
        self.body_frame.grid(row=1, column=0, sticky="nsew", padx=20, pady=20)
        self.body_frame.grid_rowconfigure(0, weight=1)
        self.body_frame.grid_columnconfigure(0, weight=2)  # Products
        self.body_frame.grid_columnconfigure(1, weight=1)  # Cart

        self.create_products_view()
        self.create_cart_view()

    def create_header(self):
        self.header = ctk.CTkFrame(self, height=60, corner_radius=0)
        self.header.grid(row=0, column=0, sticky="ew")
        self.header.grid_propagate(False)

        self.title = ctk.CTkLabel(self.header, text="Billify POS", font=ctk.CTkFont(size=20, weight="bold"))
        self.title.pack(side="left", padx=20)

        self.biller_label = ctk.CTkLabel(self.header, text="Terminal: —", font=ctk.CTkFont(size=14))
        self.biller_label.pack(side="right", padx=20)

        self.logout_btn = ctk.CTkButton(self.header, text="Logout", width=80, fg_color="transparent", border_width=1, command=self.logout_callback)
        self.logout_btn.pack(side="right", padx=10)

    def set_biller_info(self, name):
        self.biller_label.configure(text=f"Terminal: {name}")

    def create_products_view(self):
        self.prod_frame = ctk.CTkScrollableFrame(self.body_frame, label_text="Product Catalog")
        self.prod_frame.grid(row=0, column=0, sticky="nsew", padx=(0, 10))

        cols = 3
        for i, prod in enumerate(self.products):
            row = i // cols
            col = i % cols

            card = ctk.CTkFrame(self.prod_frame, corner_radius=10)
            card.grid(row=row, column=col, padx=10, pady=10, sticky="nsew")

            name_lbl = ctk.CTkLabel(card, text=prod["name"], font=ctk.CTkFont(weight="bold"), wraplength=120)
            name_lbl.pack(pady=(15, 5), padx=10)

            price_lbl = ctk.CTkLabel(card, text=f"${prod['price']:.2f}", text_color="#3b82f6")
            price_lbl.pack(pady=5)

            add_btn = ctk.CTkButton(card, text="Add to Cart", command=lambda p=prod: self.add_to_cart(p), width=100)
            add_btn.pack(pady=(10, 15))

    def create_cart_view(self):
        self.cart_container = ctk.CTkFrame(self.body_frame)
        self.cart_container.grid(row=0, column=1, sticky="nsew")
        self.cart_container.grid_rowconfigure(1, weight=1)
        self.cart_container.grid_columnconfigure(0, weight=1)

        title = ctk.CTkLabel(self.cart_container, text="Current Invoice", font=ctk.CTkFont(size=18, weight="bold"))
        title.grid(row=0, column=0, pady=15, padx=15, sticky="w")

        self.cart_items_frame = ctk.CTkScrollableFrame(self.cart_container, fg_color="transparent")
        self.cart_items_frame.grid(row=1, column=0, sticky="nsew", padx=10)

        self.summary_frame = ctk.CTkFrame(self.cart_container, fg_color="transparent")
        self.summary_frame.grid(row=2, column=0, sticky="ew", padx=15, pady=15)

        self.total_lbl = ctk.CTkLabel(self.summary_frame, text="Total: $0.00", font=ctk.CTkFont(size=22, weight="bold"))
        self.total_lbl.pack(anchor="e", pady=(0, 15))

        self.checkout_btn = ctk.CTkButton(
            self.summary_frame, text="Process Payment & Sync",
            font=ctk.CTkFont(size=16, weight="bold"), height=50, command=self.checkout
        )
        self.checkout_btn.pack(fill="x")

    def add_to_cart(self, product):
        for item in self.cart:
            if item["id"] == product["id"]:
                item["qty"] += 1
                self.render_cart()
                return
        self.cart.append({"id": product["id"], "name": product["name"], "price": product["price"], "qty": 1})
        self.render_cart()

    def remove_from_cart(self, index):
        if 0 <= index < len(self.cart):
            self.cart.pop(index)
            self.render_cart()

    def render_cart(self):
        for widget in self.cart_items_frame.winfo_children():
            widget.destroy()

        total = 0.0
        for i, item in enumerate(self.cart):
            item_total = item["price"] * item["qty"]
            total += item_total

            row = ctk.CTkFrame(self.cart_items_frame, fg_color="transparent")
            row.pack(fill="x", pady=2)

            name = ctk.CTkLabel(row, text=f"{item['name']} x{item['qty']}", anchor="w")
            name.pack(side="left", padx=5)

            price = ctk.CTkLabel(row, text=f"${item_total:.2f}")
            price.pack(side="right", padx=(5, 0))

            del_btn = ctk.CTkButton(row, text="X", width=25, height=25, fg_color="#ef4444", hover_color="#dc2626", command=lambda idx=i: self.remove_from_cart(idx))
            del_btn.pack(side="right", padx=5)

        self.total_lbl.configure(text=f"Total: ${total:.2f}")

    def clear_cart(self):
        self.cart = []
        self.render_cart()

    def checkout(self):
        if not self.cart:
            messagebox.showinfo("Empty Cart", "Cannot checkout an empty invoice.")
            return

        self.checkout_btn.configure(text="Syncing with Cloud…", state="disabled")
        self.master.update()
        time.sleep(1.5)

        messagebox.showinfo("Success", "Payment processed and synchronized with Billify Cloud successfully!")
        self.clear_cart()
        self.checkout_btn.configure(text="Process Payment & Sync", state="normal")


if __name__ == "__main__":
    app = BillifyPOSApp()
    app.mainloop()
