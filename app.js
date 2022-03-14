// get elements

const skills =document.getElementById('skill_list');
const devs_add_form =document.getElementById('devs_add_form');
const devs_edit_form =document.getElementById('devs_edit_form');
const devs_data_list =document.getElementById('add_data_list');



const loadSkills = function () {

    axios.get('http://localhost:5252/skill').then( res => {

        let skill_list ='';
        res.data.map(skill => {
            skill_list += `
                <option value="${skill.id}">${skill.name}</option>
            `;
        });

        skills.insertAdjacentHTML('beforeend', skill_list);
    });
};

loadSkills();

//Edit Skill list
const editloadSkills = function () {

    axios.get('http://localhost:5252/skill').then( res => {

        let eskill_list ='';
        res.data.map(skill => {
            eskill_list += `
                <option value="${skill.id}">${skill.name}</option>
            `;
        });

        document.querySelector('#eskill_list').insertAdjacentHTML('beforeend', eskill_list);
    });
};

editloadSkills();


/**
 * All Devs Load from Api
 */
 


function getDevelopers() {
    
    axios.get('http://localhost:5252/developers').then( res => {

        let dev_data = '';

        res.data.map( (devs, index) => {

            dev_data += `
            
            <tr class="text-center">
                <td>${ index + 1 }</td>
                <td>${ devs.name }</td>
                <td>${ devs.email }</td>
                <td>${ skillPreview(devs.skillId) }</td>
                <td><img style="width: 50px; height: 50px; object-fit: cover;" src="${ devs.photo }" alt=""></td>
                <td>
                    <a data-bs-toggle="modal" class="btn btn-info btn-sm" onclick="previewDeveloper(${devs.id})" href="#modal_view"><i class="fa fa-eye"></i></a>
                    <a data-bs-toggle="modal" class="btn btn-success btn-sm" onclick="editDeveloper(${devs.id})" href="#modal_edit"><i class="fa fa-edit"></i></a>
                    <a data-bs-toggle="modal" class="btn btn-danger btn-sm" onclick="deleteDeveloper(${devs.id})" href="#modal_delete"><i class="fa fa-trash"></i></a>
                </td>
            </tr>
            
            `;
        });
        
        devs_data_list.innerHTML = dev_data;
    });
};

getDevelopers();



/**
 * Add new Devs
 */

devs_add_form.addEventListener('submit', function(e){
    e.preventDefault();

    let name = this.querySelector('#name');
    let email = this.querySelector('#email');
    let photo = this.querySelector('#photo');
    let skill = this.querySelector('#skill_list');

    if( name.value == '' || email.value == '' || photo.value == '' || skill.value == ''){
        alert('all fields are required');
    }else{

        axios.post('http://localhost:5252/developers', {

        id          : "",
        name        : name.value,
        email       : email.value,
        skillId     : skill.value,
        photo       : photo.value
        
        }).then( res => {

            name.value = '';
            email.value = '';
            photo.value = '';
            skill.value = '';

            getDevelopers();
        });

        
    }

    
});


/**
 * Edit Devs data from Api
 * @param {*} id 
 */

function editDeveloper(id){
//get data from dom
    let name = document.getElementById('ename');
    let email = document.getElementById('eemail');
    let photo = document.getElementById('ephoto');
    let skill = document.getElementById('eskill_list');
    let preview = document.getElementById('epreview');
    let edit_id = document.getElementById('edit_id');

//get data from api
    axios.get(`http://localhost:5252/developers/${id}`).then( res => {
    
    preview.setAttribute('src', res.data.photo);
    name.value = res.data.name;
    email.value = res.data.email;
    photo.value = res.data.photo;
    edit_id.value = id;
    skill.children[res.data.skillId].setAttribute('selected', true);
    

    });
};

devs_edit_form.addEventListener('submit', function(e) {
    e.preventDefault();

    let name = this.querySelector('#ename');
    let email = this.querySelector('#eemail');
    let photo = this.querySelector('#ephoto');
    let skill = this.querySelector('#eskill_list');
    let edit_id = this.querySelector('#edit_id');

    axios.patch(`http://localhost:5252/developers/${edit_id.value}`, {
        
        id          : "",
        name        : name.value,
        email       : email.value,
        photo       : photo.value,
        skillId     : skill.value

    }).then( res => {

        name.value = '';
        email.value = '';
        photo.value = '';
        skill.value = '';

        getDevelopers();

    });

});


/**
 * Delete Devs data from Api
 */
let delete_dev;

function deleteDeveloper(id) {
    delete_dev = id;
};

function confirmDelete() {
    
    axios.delete(`http://localhost:5252/developers/${delete_dev}`).then( res => {

        getDevelopers();

    });
    
};


/**
 * View Devs Data from Api
 * @param {*} id 
 */

function previewDeveloper(id) {

    axios.get(`http://localhost:5252/developers/${id}`).then( res => {

        document.querySelector('#dev_view').innerHTML = `
        
                    <tr class="text-center">
                        <th>ID</th>
                        <td>${res.data.id}</td>
                    </tr>

                    <tr class="text-center">
                        <th>Name</th>
                        <td>${res.data.name}</td>
                    </tr>

                    <tr class="text-center">
                        <th>E-mail</th>
                        <td>${res.data.email}</td>
                    </tr>
                    <tr class="text-center">
                        <th>Skill</th>
                        <td>${skillPreview(res.data.skillId)}</td>
                    </tr>        
        `;

        document.querySelector('#preview_image').setAttribute('src', res.data.photo);
    });
};


