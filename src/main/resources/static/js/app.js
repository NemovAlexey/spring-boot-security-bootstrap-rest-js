$(async function () {
    await getTableWithUsers();
    await getDefaultModal();
    await addNewUser();
    getNavBarBrand();
    getTableWithOneUser();
})

const userFetchService = {
    head: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
        'Referer': null
    },
    findAuthenticatedUser: async () => await fetch('api/authorized_user'),
    findAllRoles: async () => await fetch('api/roles'),
    findAllUsers: async () => await fetch('api/users'),
    findOneUser: async (id) => await fetch(`api/users/${id}`),
    addNewUser: async (user) => await fetch('api/users', {
        method: 'POST',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    updateUser: async (user) => await fetch(`api/users/`, {
        method: 'PUT',
        headers: userFetchService.head,
        body: JSON.stringify(user)
    }),
    deleteUser: async (id) => await fetch(`api/users/${id}`, {
        method: 'DELETE',
        headers: userFetchService.head
    })
}

function getNavBarBrand() {
    let navBarBrand = $('#navBarBrand');
    navBarBrand.empty();
    userFetchService.findAuthenticatedUser()
        .then(response => response.json())
        .then(user => {
            let navBarBrandFilling = `<b>${user.email}</b> with roles: ${user.roles.map(role => role.name.toString().substring(5))}`;
            navBarBrand.append(navBarBrandFilling);
        })
}

function getTableWithOneUser() {
    let table = $('#tableAboutUser tbody');
    table.empty();

    userFetchService.findAuthenticatedUser()
        .then(response => response.json())
        .then(user => {
            let tableFilling = `$(
                    <tr>
                        <td>${user.id}</td>
                        <td>${user.firstName}</td>
                        <td>${user.lastName}</td>
                        <td>${user.age}</td> 
                        <td>${user.email}</td>
                        <td>${user.roles.map(role => role.name.toString().substring(5))}</td>
                    </tr>
            )`;
            table.append(tableFilling);
        })
}

async function getTableWithUsers() {
    let table = $('#mainTableWithUsers tbody');
    table.empty();

    await userFetchService.findAllUsers()
        .then(response => response.json())
        .then(users => {
            users.forEach(user => {
                let tableFilling = `$(
                        <tr>
                            <td>${user.id}</td>
                            <td>${user.firstName}</td>
                            <td>${user.lastName}</td>
                            <td>${user.age}</td> 
                            <td>${user.email}</td>
                            <td>${user.roles.map(role => role.name.toString().substring(5))}</td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="edit" class="btn btn-primary" 
                                data-toggle="modal" data-target="#someDefaultModal">Edit</button>
                            </td>
                            <td>
                                <button type="button" data-userid="${user.id}" data-action="delete" class="btn btn-danger" 
                                data-toggle="modal" data-target="#someDefaultModal">Delete</button>
                            </td>
                        </tr>
                )`;
                table.append(tableFilling);
            })
        })

    // Buttons Edit & Delete click handling
    $("#mainTableWithUsers").find('button').on('click', (event) => {
        let modalFormUser = $('#modalFormUser');
        let targetButton = $(event.target);
        let buttonUserId = targetButton.attr('data-userid');
        let buttonAction = targetButton.attr('data-action');
        modalFormUser.attr('data-userid', buttonUserId);
        modalFormUser.attr('data-action', buttonAction);
        modalFormUser.modal('show');
    })
}

// Handle opening and closing modal
async function getDefaultModal() {
    $('#modalFormUser').modal({
        keyboard: true,
        backdrop: "static",
        show: false
    }).on("show.bs.modal", (event) => {
        let thisModal = $(event.target);
        let userid = thisModal.attr('data-userid');
        let action = thisModal.attr('data-action');
        switch (action) {
            case 'edit':
                editUser(thisModal, userid);
                break;
            case 'delete':
                deleteUser(thisModal, userid);
                break;
        }
    }).on("hidden.bs.modal", (e) => {
        let thisModal = $(e.target);
        thisModal.find('.modal-title').html('');
        thisModal.find('.modal-body').html('');
        thisModal.find('.modal-footer').html('');
    })
}

//Modal Edit user
async function editUser(modal, id) {
    let response = await userFetchService.findOneUser(id);
    let user = response.json();

    //Modal Title
    modal.find('.modal-title').html('Edit user');

    //Modal Body
    user.then(async user => {
        let options = await getRoleOptions();
        let bodyForm = `
            <div class="container-fluid  bg-white text-center">
                <div class="col-6 mx-auto">
                    <form class="form-group" id="editUser">
                        <div class="mb-3">
                            <label for="id" class="form-label fw-bold mb-0">ID</label>
                            <input class="form-control" id="id" type="text" value="${user.id}" disabled>
                        </div>                
                        <div class="mb-3">
                            <label for="firstName" class="form-label fw-bold mb-0">First Name</label>
                            <input class="form-control" id="firstName" type="text" value="${user.firstName}">
                        </div>
                        <div class="mb-3">
                            <label for="lastName" class="form-label fw-bold mb-0">Last Name</label>
                            <input class="form-control" id="lastName" type="text" value="${user.lastName}">
                        </div>
                        <div class="mb-3">
                            <label for="age" class="form-label fw-bold mb-0">Age</label>
                            <input class="form-control" id="age" type="number" value="${user.age}">
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label fw-bold mb-0">Email</label>
                            <input class="form-control" id="email" type="email" value="${user.email}">
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label fw-bold mb-0">Password</label>
                            <input class="form-control" id="password" type="password" value="${user.password}">
                        </div>
                        <label for="roles" class="form-label fw-bold mb-0">Role</label>
                        <select multiple class="form-control mb-3" size="2" id="roles">
                            ${options}
                        </select>
                    </form>
                </div>
            </div>
        `;
        modal.find('.modal-body').append(bodyForm);
    })

    //Modal Footer
    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
    let editButton = `<button  class="btn btn-primary" id="editButton">Edit</button>`;
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(editButton);

    //Click on the Edit button
    $("#editButton").on('click', async () => {
        let data = {
            'id': modal.find("#id").val(),
            'firstName': modal.find("#firstName").val().trim(),
            'lastName': modal.find("#lastName").val().trim(),
            'age': modal.find("#age").val().trim(),
            'email': modal.find("#email").val().trim(),
            'password': modal.find("#password").val().trim(),
            'roles': modal.find('#roles').val().map(roleId => parseInt(roleId))
        }
        await userFetchService.updateUser(data);
        await getTableWithUsers();
        modal.modal('hide');
    })
}

//Modal Delete user
async function deleteUser(modal, id) {
    let response = await userFetchService.findOneUser(id);
    let user = response.json();

    //Modal Title
    modal.find('.modal-title').html('Delete user');

    //Modal Body
    let options = await getRoleOptions();
    user.then(user => {
        let bodyForm = `
            <div class="container-fluid  bg-white text-center">
                <div class="col-6 mx-auto">
                    <form class="form-group" id="editUser">
                        <div class="mb-3">
                            <label for="id" class="form-label fw-bold mb-0">ID</label>
                            <input class="form-control" id="id" name="id" type="text" value="${user.id}" disabled>
                        </div>                
                        <div class="mb-3">
                            <label for="firstName" class="form-label fw-bold mb-0">First Name</label>
                            <input class="form-control" id="firstName" name="firstName" type="text" value="${user.firstName}" disabled>
                        </div>
                        <div class="mb-3">
                            <label for="lastName" class="form-label fw-bold mb-0">Last Name</label>
                            <input class="form-control" id="lastName" name="lastName" type="text" value="${user.lastName}" disabled>
                        </div>
                        <div class="mb-3">
                            <label for="age" class="form-label fw-bold mb-0">Age</label>
                            <input class="form-control" id="age" type="number" value="${user.age}" disabled>
                        </div>
                        <div class="mb-3">
                            <label for="email" class="form-label fw-bold mb-0">Email</label>
                            <input class="form-control" id="email" type="email" value="${user.email}" disabled>
                        </div>
                        <label for="roleNames" class="form-label fw-bold mb-0">Role</label>
                        <select multiple class="form-control mb-3" size="2" id="roles" disabled>
                            ${options}
                        </select>
                    </form>
                </div>
            </div>
        `;
        modal.find('.modal-body').append(bodyForm);

    })

    //Modal Footer
    let closeButton = `<button type="button" class="btn btn-secondary" data-bs-dismiss="modal">Close</button>`;
    let deleteButton = `<button  class="btn btn-danger" id="deleteButton">Delete</button>`;
    modal.find('.modal-footer').append(closeButton);
    modal.find('.modal-footer').append(deleteButton);

    //Click on the Delete button
    $("#deleteButton").on('click', async () => {
        await userFetchService.deleteUser(id);
        await getTableWithUsers();
        modal.modal('hide');
    })
}

async function getRoleOptions() {
    let options;
    await userFetchService.findAllRoles()
        .then(response => response.json())
        .then(roles => {
            roles.forEach(role => {
                options += `<option value=${role.id}>${role.name.toString().substring(5)}</option>`;
            })
        })
    return options;
}

async function loadNewUserForm() {
    let addUserForm = $('#addUserForm');
    addUserForm.find("#newFirstName").val('');
    addUserForm.find("#newLastName").val('');
    addUserForm.find('#newAge').val('0');
    addUserForm.find('#newEmail').val('');
    addUserForm.find('#newPassword').val('');
   $('#newRoles')
        .empty()
        .append(await getRoleOptions());
}

//Tab Add new user
async function addNewUser() {
    await loadNewUserForm();

    //Click on the Add new user button
    $('#addNewUserButton').click(async () => {
        let addUserForm = $('#addUserForm')
        let user = {
            'firstName': addUserForm.find('#newFirstName').val(),
            'lastName': addUserForm.find('#newLastName').val(),
            'age': addUserForm.find('#newAge').val(),
            'email': addUserForm.find('#newEmail').val(),
            'password': addUserForm.find('#newPassword').val(),
            'roles': addUserForm.find('#newRoles').val().map(roleId => parseInt(roleId))
        };
        await userFetchService.addNewUser(user);

        //Update table, change tab
        await getTableWithUsers();
        await loadNewUserForm();
        let adminTab = document.querySelector('#nav-allUsers-tab');
        let tab = new bootstrap.Tab(adminTab);
        tab.show();
    })
}