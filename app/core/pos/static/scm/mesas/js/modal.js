document.addEventListener('DOMContentLoaded', function() {
    
    // #selctores propios
    let contenedorMesas=document.querySelector('.contenedor-modal');
    console.log('contenedorMesas: ', contenedorMesas);

    let modal = document.querySelector('#myModal');
    let btnCloseModal = document.querySelector('.close-modal');
    contenedorMesas.addEventListener('click', (e) => {
        console.log(e.target)
        if (e.target.classList.contains('card-mesa')) {
            mostrarModal()
        }
    });

    function mostrarModal() {
        modal.style.display = 'block';
    }

    btnCloseModal.addEventListener('click', () => {
        modal.style.display = 'none';
    });

});