function getData() {
    var parameters = {
        'action': 'search',
    };

    $('#data').DataTable({
        responsive: true,
        autoWidth: false,
        destroy: true,
        deferRender: true,
        ajax: {
            url: pathname,
            type: 'POST',
            headers: {
                'X-CSRFToken': csrftoken
            },
            data: parameters,
            dataSrc: ""
        },
        columns: [
            {data: "id"},
            {data: "name"},
            {data: "category.name"},
            {data: "category.inventoried"},
            {data: "image"},
            {data: "price"},
            {data: "pvp"},
            {data: "id"},
        ],
        columnDefs: [
            {
                targets: [3],
                class: 'text-center',
                render: function (data, type, row) {
                    if (row.category.inventoried) {
                        return 'Si';
                    }
                    return 'No';
                }
            },
            {
                targets: [4],
                class: 'text-center',
                render: function (data, type, row) {
                    return '<img src="' + row.image + '" class="img-fluid d-block mx-auto" style="width: 20px; height: 20px;">';
                }
            },
            {
                targets: [-4, -5, -3],
                class: 'text-center',
                render: function (data, type, row) {
                    return 'S/.' + parseFloat(data).toFixed(2);
                }
            },
            {
                targets: [-1],
                class: 'text-center',
                render: function (data, type, row) {
                    var buttons = '';
                    buttons += '<a href="/pos/scm/product/update/' + row.id + '/" class="btn btn-warning btn-xs btn-flat"><i class="fas fa-edit"></i></a> ';
                    buttons += '<a href="/pos/scm/product/delete/' + row.id + '/" class="btn btn-danger btn-xs btn-flat"><i class="fas fa-trash"></i></a> ';
                    return buttons;
                }
            },
        ],
        rowCallback: function (row, data, index) {

        },
        initComplete: function (settings, json) {

        }
    });
}

$(function () {
    getData();
})