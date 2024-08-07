document.addEventListener("DOMContentLoaded", () => {
    const productList = document.getElementById('product-list');
    const cartItemsDiv = document.getElementById('cart-items');
    const totalPriceSpan = document.getElementById('total-price');
    const clearCartButton = document.getElementById('clear-cart');
    const navLinks = document.querySelectorAll('.nav-link');

    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    updateCart();

    fetch('js/products.json')
        .then(response => {
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => displayProducts(data))
        .catch(error => console.error('Error fetching products:', error));

    function displayProducts(products) {
        products.forEach(product => {
            const productDiv = document.createElement('div');
            productDiv.className = 'product';
            productDiv.innerHTML = `
                <img src="${product.image}" alt="${product.name}">
                <h3>${product.name}</h3>
                <p>Price: $${product.price.toFixed(2)}</p>
                <button onclick="addToCart(${product.id})">Add to Cart</button>
            `;
            productList.appendChild(productDiv);
        });
    }

    window.addToCart = function (productId) {
        fetch('js/products.json')
            .then(response => response.json())
            .then(products => {
                const product = products.find(p => p.id === productId);
                cart.push(product);
                localStorage.setItem('cart', JSON.stringify(cart));
                updateCart();
            });
    };

    function updateCart() {
        cartItemsDiv.innerHTML = '';
        let total = 0;
        cart.forEach(item => {
            total += item.price;
            const cartItemDiv = document.createElement('div');
            cartItemDiv.className = 'cart-item';
            cartItemDiv.innerHTML = `
                <h4>${item.name}</h4>
                <p>$${item.price.toFixed(2)}</p>
            `;
            cartItemsDiv.appendChild(cartItemDiv);
        });
        totalPriceSpan.innerText = total.toFixed(2);
    }

    clearCartButton.addEventListener('click', () => {
        cart = [];
        localStorage.removeItem('cart');
        updateCart();
    });

    // Smooth scrolling and active link highlighting
    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href').substring(1);
            document.getElementById(targetId).scrollIntoView({ behavior: 'smooth' });
            setActiveLink(this);
        });
    });

    function setActiveLink(activeLink) {
        navLinks.forEach(link => link.classList.remove('active'));
        activeLink.classList.add('active');
    }

    // Highlight the correct link on page load based on scroll position
    document.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY;
        navLinks.forEach(link => {
            const section = document.querySelector(link.getAttribute('href'));
            if (
                section.offsetTop <= scrollPosition &&
                section.offsetTop + section.offsetHeight > scrollPosition
            ) {
                setActiveLink(link);
            }
        });
    });
});
