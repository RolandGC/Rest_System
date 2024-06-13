let numeroMesa = null
document.addEventListener('DOMContentLoaded', function() {


    // #selctores propios
    let contenedorMesas = document.querySelector('.contenedor-modal');
    console.log(contenedorMesas)
    let modal = document.querySelector('#myModal');
    let btnCloseModal = document.querySelector('.close-modal');
    contenedorMesas.addEventListener('click', (e) => {
        console.log(e.target)
        if (e.target.classList.contains('card-mesa')) {
            const mesa = e.target
            numeroMesa = mesa.getAttribute('data-mesaId')
            console.log(numeroMesa)
            mostrarModal()
        }
    });

    function mostrarModal() {
        var modal = document.getElementById('myModal');
        modal.style.display = 'block';
        document.body.style.overflow = 'hidden'; // Prevent background scroll
    }

    function ocultarModal() {
        var modal = document.getElementById('myModal');
        modal.style.display = 'none';
        document.body.style.overflow = ''; // Restore background scroll
    }

    // Optional: Add event listener to close the modal when clicking outside the modal-content
    window.onclick = function(event) {
        var modal = document.getElementById('myModal');
        if (event.target === modal) {
            ocultarModal();
        }
    }


    btnCloseModal.addEventListener('click', () => {
        modal.style.display = 'none';
        window.location.reload()
    });

});