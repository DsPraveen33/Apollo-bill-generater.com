// Medicine database with common medications and their prices
const medicineDatabase = [
    { name: "Paracetamol 500mg", price: 15.00 },
    { name: "Amoxicillin 500mg", price: 85.00 },
    { name: "Omeprazole 20mg", price: 120.00 },
    { name: "Metformin 500mg", price: 45.00 },
    { name: "Amlodipine 5mg", price: 75.00 },
    { name: "Cetirizine 10mg", price: 35.00 },
    { name: "Aspirin 150mg", price: 25.00 },
    { name: "Diclofenac 50mg", price: 40.00 },
    { name: "Pantoprazole 40mg", price: 130.00 },
    { name: "Azithromycin 500mg", price: 180.00 },
    { name: "Montelukast 10mg", price: 160.00 },
    { name: "Vitamin D3 60K", price: 95.00 },
    { name: "B-Complex", price: 65.00 },
    { name: "Calcium + Vitamin D3", price: 155.00 },
    { name: "Dolo 650mg", price: 30.00 }
];

document.addEventListener('DOMContentLoaded', function() {
    // Create particles container
    const particlesContainer = document.createElement('div');
    particlesContainer.className = 'particles';
    document.body.appendChild(particlesContainer);

    // Create particles
    function createParticles() {
        for (let i = 0; i < 50; i++) {
            const particle = document.createElement('div');
            particle.className = 'particle';
            
            // Random size between 5 and 15 pixels
            const size = Math.random() * 10 + 5;
            particle.style.width = `${size}px`;
            particle.style.height = `${size}px`;
            
            // Random position
            particle.style.left = `${Math.random() * 100}%`;
            particle.style.top = `${Math.random() * 100}%`;
            
            // Random animation duration between 15 and 30 seconds
            const duration = Math.random() * 15 + 15;
            particle.style.animation = `float ${duration}s infinite linear`;
            
            // Random delay
            particle.style.animationDelay = `${Math.random() * -30}s`;
            
            particlesContainer.appendChild(particle);
        }
    }

    createParticles();

    // Add subtle parallax effect
    document.addEventListener('mousemove', function(e) {
        const moveX = (e.clientX - window.innerWidth / 2) * 0.01;
        const moveY = (e.clientY - window.innerHeight / 2) * 0.01;
        
        document.body.style.backgroundPosition = `${moveX}px ${moveY}px`;
        particlesContainer.style.transform = `translate(${moveX * 2}px, ${moveY * 2}px)`;
    });

    // Existing medicine database code...

    // Toolbar button handlers
    document.getElementById('newBill').addEventListener('click', function() {
        if(confirm('Start a new bill? Current bill will be cleared.')) {
            clearBill();
        }
    });

    document.getElementById('saveBill').addEventListener('click', function() {
        saveBill();
    });

    document.getElementById('exportPDF').addEventListener('click', function() {
        exportToPDF();
    });

    document.getElementById('emailBill').addEventListener('click', function() {
        emailBill();
    });

    // Function to clear the current bill
    function clearBill() {
        document.getElementById('customerName').value = '';
        document.getElementById('customerPhone').value = '';
        document.getElementById('customerAddress').value = '';
        
        const productList = document.getElementById('productList');
        productList.innerHTML = `
            <div class="product-entry">
                <input type="text" placeholder="Medicine Name" class="medicine-name">
                <input type="number" placeholder="Quantity" class="quantity">
                <input type="number" placeholder="Price" class="price">
                <button class="remove-product"><i class="fas fa-times"></i></button>
            </div>
        `;
        
        calculateTotals();
        document.getElementById('billPreview').classList.add('hidden');
    }

    // Function to save bill (you can modify this to save to local storage or server)
    function saveBill() {
        const billData = {
            customerName: document.getElementById('customerName').value,
            customerPhone: document.getElementById('customerPhone').value,
            customerAddress: document.getElementById('customerAddress').value,
            products: [],
            subtotal: document.getElementById('subtotal').textContent,
            gst: document.getElementById('gst').textContent,
            total: document.getElementById('total').textContent,
            date: new Date().toLocaleString()
        };

        document.querySelectorAll('.product-entry').forEach(entry => {
            billData.products.push({
                name: entry.querySelector('.medicine-name').value,
                quantity: entry.querySelector('.quantity').value,
                price: entry.querySelector('.price').value
            });
        });

        // Save to localStorage (you can modify this to save to a server)
        const savedBills = JSON.parse(localStorage.getItem('apolloBills') || '[]');
        savedBills.push(billData);
        localStorage.setItem('apolloBills', JSON.stringify(savedBills));

        alert('Bill saved successfully!');
    }

    // Function to export bill as PDF
    function exportToPDF() {
        // First generate the bill preview
        document.getElementById('generateBill').click();
        
        // Remove the hidden class temporarily
        const billPreview = document.getElementById('billPreview');
        billPreview.classList.remove('hidden');
        
        // Use window.print() which will trigger the print stylesheet
        window.print();
        
        // Add the hidden class back
        billPreview.classList.add('hidden');
    }

    // Function to email bill
    function emailBill() {
        const customerEmail = prompt('Please enter customer email address:');
        if (customerEmail && validateEmail(customerEmail)) {
            alert(`Bill will be sent to ${customerEmail}\n(This is a demo feature)`);
        } else if (customerEmail) {
            alert('Please enter a valid email address');
        }
    }

    // Email validation helper
    function validateEmail(email) {
        return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    }

    const addProductBtn = document.getElementById('addProduct');
    const productList = document.getElementById('productList');
    const generateBillBtn = document.getElementById('generateBill');
    const printBillBtn = document.getElementById('printBill');
    const medicineSearchInput = document.getElementById('medicineSearch');
    const medicineListDatalist = document.getElementById('medicineList');

    // Populate medicine datalist
    medicineDatabase.forEach(medicine => {
        const option = document.createElement('option');
        option.value = medicine.name;
        medicineListDatalist.appendChild(option);
    });

    // Add new product entry
    addProductBtn.addEventListener('click', function() {
        const productEntry = document.createElement('div');
        productEntry.className = 'product-entry';
        productEntry.innerHTML = `
            <input type="text" placeholder="Medicine Name" class="medicine-name">
            <input type="number" placeholder="Quantity" class="quantity">
            <input type="number" placeholder="Price" class="price">
            <button class="remove-product">×</button>
        `;
        productList.appendChild(productEntry);

        // Add event listeners for calculation and removal
        addProductListeners(productEntry);
    });

    // Handle medicine search
    medicineSearchInput.addEventListener('input', function(e) {
        const selectedMedicine = medicineDatabase.find(med => med.name === e.target.value);
        if (selectedMedicine) {
            // Create new product entry with selected medicine
            const productEntry = document.createElement('div');
            productEntry.className = 'product-entry';
            productEntry.innerHTML = `
                <input type="text" value="${selectedMedicine.name}" class="medicine-name" readonly>
                <input type="number" placeholder="Quantity" class="quantity" value="1">
                <input type="number" value="${selectedMedicine.price}" class="price" readonly>
                <button class="remove-product">×</button>
            `;
            productList.appendChild(productEntry);
            addProductListeners(productEntry);
            calculateTotals();
            
            // Clear the search input
            medicineSearchInput.value = '';
        }
    });

    // Remove product entry
    function addProductListeners(productEntry) {
        const removeBtn = productEntry.querySelector('.remove-product');
        const inputs = productEntry.querySelectorAll('input');

        removeBtn.addEventListener('click', function() {
            productEntry.remove();
            calculateTotals();
        });

        inputs.forEach(input => {
            input.addEventListener('input', calculateTotals);
        });
    }

    // Calculate totals
    function calculateTotals() {
        let subtotal = 0;
        const productEntries = document.querySelectorAll('.product-entry')

        productEntries.forEach(entry => {
            const quantity = parseFloat(entry.querySelector('.quantity').value) || 0;
            const price = parseFloat(entry.querySelector('.price').value) || 0;
            subtotal += quantity * price;
        });

        const gst = subtotal * 0.18;
        const total = subtotal + gst;

        document.getElementById('subtotal').textContent = `₹${subtotal.toFixed(2)}`;
        document.getElementById('gst').textContent = `₹${gst.toFixed(2)}`;
        document.getElementById('total').textContent = `₹${total.toFixed(2)}`;
    }

    // Generate Bill
    generateBillBtn.addEventListener('click', function() {
        const customerName = document.getElementById('customerName').value;
        const customerPhone = document.getElementById('customerPhone').value;
        const customerAddress = document.getElementById('customerAddress').value;
        const billPreview = document.getElementById('billPreview');
        
        let productsHTML = '';
        let subtotal = 0;
        
        document.querySelectorAll('.product-entry').forEach((entry, index) => {
            const medicine = entry.querySelector('.medicine-name').value;
            const quantity = entry.querySelector('.quantity').value;
            const price = entry.querySelector('.price').value;
            const amount = quantity * price;
            subtotal += amount;
            
            productsHTML += `
                <tr>
                    <td>${index + 1}</td>
                    <td>${medicine}</td>
                    <td>${quantity}</td>
                    <td>₹${price}</td>
                    <td>₹${amount.toFixed(2)}</td>
                </tr>
            `;
        });

        const gst = subtotal * 0.18;
        const total = subtotal + gst;

        const currentDate = new Date().toLocaleDateString();
        const billNumber = 'AP' + Date.now().toString().slice(-6);

        billPreview.innerHTML = `
            <div class="bill-header">
                <h2>Apollo Pharmacy</h2>
                <p>Bill No: ${billNumber}</p>
                <p>Date: ${currentDate}</p>
            </div>
            <div class="customer-info">
                <p><strong>Customer Name:</strong> ${customerName}</p>
                <p><strong>Phone:</strong> ${customerPhone}</p>
                <p><strong>Address:</strong> ${customerAddress}</p>
            </div>
            <table class="bill-table">
                <thead>
                    <tr>
                        <th>No.</th>
                        <th>Medicine</th>
                        <th>Quantity</th>
                        <th>Price</th>
                        <th>Amount</th>
                    </tr>
                </thead>
                <tbody>
                    ${productsHTML}
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="4">Subtotal</td>
                        <td>₹${subtotal.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4">GST (18%)</td>
                        <td>₹${gst.toFixed(2)}</td>
                    </tr>
                    <tr>
                        <td colspan="4"><strong>Total</strong></td>
                        <td><strong>₹${total.toFixed(2)}</strong></td>
                    </tr>
                </tfoot>
            </table>
            <div class="bill-footer">
                <p>Thank you for choosing Apollo Pharmacy!</p>
                <p>For any queries, please contact: 1860-500-0101</p>
            </div>
        `;

        billPreview.classList.remove('hidden');
    });

    // Print Bill
    printBillBtn.addEventListener('click', function() {
        window.print();
    });

    // Add listeners to initial product entry
    addProductListeners(document.querySelector('.product-entry'));

    // Load selected products from products page
    function loadSelectedProducts() {
        const selectedProducts = JSON.parse(localStorage.getItem('selectedProducts') || '[]');
        
        if (selectedProducts.length > 0) {
            // Remove existing product entries except the first one
            const productList = document.getElementById('productList');
            while (productList.children.length > 1) {
                productList.removeChild(productList.lastChild);
            }

            // Add each selected product
            selectedProducts.forEach((product, index) => {
                if (index === 0) {
                    // Update first product entry
                    const firstEntry = productList.firstElementChild;
                    firstEntry.querySelector('.medicine-name').value = product.name;
                    firstEntry.querySelector('.quantity').value = product.quantity;
                    firstEntry.querySelector('.price').value = product.price;
                } else {
                    // Add new product entry
                    const productEntry = document.createElement('div');
                    productEntry.className = 'product-entry';
                    productEntry.innerHTML = `
                        <input type="text" value="${product.name}" class="medicine-name" readonly>
                        <input type="number" value="${product.quantity}" class="quantity">
                        <input type="number" value="${product.price}" class="price" readonly>
                        <button class="remove-product"><i class="fas fa-times"></i></button>
                    `;
                    productList.appendChild(productEntry);
                    addProductListeners(productEntry);
                }
            });

            // Clear localStorage after loading
            localStorage.removeItem('selectedProducts');
            
            // Calculate totals
            calculateTotals();
        }
    }

    // Call loadSelectedProducts when page loads
    loadSelectedProducts();
});
// Sample Product Data (This could be fetched from a database or API in real applications)
const products = [
    {
        name: "Dolo 650mg",
        category: "tablets",
        description: "Paracetamol tablet for fever and pain relief",
        price: 30,
        image: "https://www.netmeds.com/images/product-v1/600x600/341517/dolo_650_tablet_15_s_0.jpg"
    },
    {
        name: "Azithromycin 500mg",
        category: "tablets",
        description: "Antibiotic for bacterial infections",
        price: 180,
        image: "https://5.imimg.com/data5/SELLER/Default/2021/3/KO/QG/XG/3823480/azithromycin-500-mg-tablets-500x500.jpg"
    },
    {
        name: "Covaxin Injection",
        category: "injections",
        description: "COVID-19 vaccine injection",
        price: 1500,
        image: "https://www.apollopharmacy.in/pub/media/catalog/product/cache/874fdb3a004b01d92ad3ff43a77860f3/i/m/image_67.jpg"
    },
    {
        name: "Paracetamol Syrup",
        category: "syrups",
        description: "For fever and pain relief in liquid form",
        price: 60,
        image: "https://www.1mg.com/media/medicines/cough-cold-antiallergics-mentholated-products-53s3cn5gmq.jpg"
    },
    {
        name: "Vitamin C Capsules",
        category: "capsules",
        description: "Capsules for immune system support",
        price: 120,
        image: "https://www.netmeds.com/images/product-v1/600x600/348612/healthvit_vitamin_c_1000_mg_capsule_60_caps_0.jpg"
    }
];

// Function to display products
function displayProducts(filteredProducts) {
    const productsContainer = document.getElementById("products-container");
    productsContainer.innerHTML = ""; // Clear existing products

    filteredProducts.forEach(product => {
        const productCard = document.createElement("div");
        productCard.classList.add("product-card");

        productCard.innerHTML = `
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-details">
                <span class="category-label">${product.category.charAt(0).toUpperCase() + product.category.slice(1)}</span>
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">₹${product.price}</div>
                <button class="add-to-cart">Add to Bill</button>
            </div>
        `;

        productsContainer.appendChild(productCard);
    });
}

// Function to filter products by category
function filterCategory(category) {
    // Reset active filter button
    const filterBtns = document.querySelectorAll(".filter-btn");
    filterBtns.forEach(btn => btn.classList.remove("active"));

    const activeBtn = document.querySelector(`.filter-btn:contains(${category})`);
    if (activeBtn) activeBtn.classList.add("active");

    // Filter products based on category
    if (category === "all") {
        displayProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        displayProducts(filteredProducts);
    }
}

// Function to handle search input
document.getElementById("search-bar").addEventListener("input", function() {
    const query = this.value.toLowerCase();
    const filteredProducts = products.filter(product => product.name.toLowerCase().includes(query));
    displayProducts(filteredProducts);
});

// Initially display all products
displayProducts(products);
