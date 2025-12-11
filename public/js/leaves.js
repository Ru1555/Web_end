// 🍁 GSAP 楓葉飄落動畫
function createLeaf() {
    const leaf = document.getElementById("leafTemplate").cloneNode(true);
    leaf.style.display = "block";
    leaf.style.left = Math.random() * window.innerWidth + "px";
    document.body.appendChild(leaf);

    gsap.to(leaf, {
        y: window.innerHeight + 100,
        x: "+=" + (Math.random() * 200 - 100),
        rotation: Math.random() * 360,
        duration: Math.random() * 6 + 5,
        ease: "linear",
        onComplete: () => leaf.remove()
    });
}

//QR Code 顯示
function showQR() {
    document.getElementById("qrModal").classList.add("active");
}

function closeQR() {
    document.getElementById("qrModal").classList.remove("active");
}


setInterval(createLeaf, 1200);
