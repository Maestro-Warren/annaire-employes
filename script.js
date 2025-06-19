// Récupération des éléments du DOM
const employeeForm = document.getElementById('employeeForm');
const employeeListDiv = document.getElementById('employeeList');
const searchInput = document.getElementById('searchInput'); // Champ de recherche

const nomInput = document.getElementById('nom');
const prenomInput = document.getElementById('prenom');
const emailInput = document.getElementById('email');
const posteInput = document.getElementById('poste');
const submitBtn = employeeForm.querySelector('button[type="submit"]');

// Initialisation des données
let employees = JSON.parse(localStorage.getItem('employees')) || []; 
let editingEmployeeId = null; 

// Sauvegarde dans localStorage
const saveToStorage = () => {
  localStorage.setItem('employees', JSON.stringify(employees));
};

// Affichage de la liste des employés avec filtre optionnel
const renderEmployeeList = (filter = '') => {
  employeeListDiv.innerHTML = ''; // Réinitialise la zone d’affichage

  // Filtrage selon le texte de recherche (nom, prénom, email ou poste)
  const filteredEmployees = employees.filter(emp => {
    const content = `${emp.nom} ${emp.prenom} ${emp.email} ${emp.poste}`.toLowerCase();
    return content.includes(filter.toLowerCase());
  });

  // Si aucun résultat
  if (filteredEmployees.length === 0) {
    employeeListDiv.innerHTML = '<p>Aucun employé correspondant.</p>';
    return;
  }

  // Affichage des employés filtrés
  filteredEmployees.forEach(employee => {
    const employeeCard = document.createElement('div');
    employeeCard.classList.add('employee-card');
    employeeCard.dataset.id = employee.id;

    employeeCard.innerHTML = `
      <div class="employee-info">
        <p><i class="fas fa-user"></i> <strong>Nom Complet:</strong> ${employee.prenom} ${employee.nom}</p>
        <p><i class="fas fa-envelope"></i> <strong>Email:</strong> ${employee.email}</p>
        <p><i class="fas fa-briefcase"></i> <strong>Poste:</strong> ${employee.poste}</p>
      </div>
      <div style="display:flex; gap:10px; margin-top:10px;">
        <button class="edit-btn"><i class="fas fa-edit"></i> Modifier</button>
        <button class="delete-btn"><i class="fas fa-trash"></i> Supprimer</button>
      </div>
    `;

    // Bouton supprimer
    employeeCard.querySelector('.delete-btn').addEventListener('click', () => {
      deleteEmployee(employee.id);
    });

    // Bouton modifier
    employeeCard.querySelector('.edit-btn').addEventListener('click', () => {
      loadEmployeeForEditing(employee);
    });

    employeeListDiv.appendChild(employeeCard);
  });
};

// Chargement d’un employé pour modification
const loadEmployeeForEditing = (employee) => {
  nomInput.value = employee.nom;
  prenomInput.value = employee.prenom;
  emailInput.value = employee.email;
  posteInput.value = employee.poste;
  editingEmployeeId = employee.id;
  submitBtn.innerHTML = '<i class="fas fa-save"></i> Mettre à jour'; 
};

// Soumission du formulaire (ajout ou mise à jour)
employeeForm.addEventListener('submit', (e) => {
  e.preventDefault(); 

  const nom = nomInput.value.trim();
  const prenom = prenomInput.value.trim();
  const email = emailInput.value.trim();
  const poste = posteInput.value.trim();

  if (nom && prenom && email && poste) {
    if (editingEmployeeId) {
      // Mise à jour de l’employé
      employees = employees.map(emp =>
        emp.id === editingEmployeeId
          ? { ...emp, nom, prenom, email, poste }
          : emp
      );

      editingEmployeeId = null;
      submitBtn.innerHTML = '<i class="fas fa-plus"></i> Ajouter l\'employé';
    } else {
      // Ajout d’un nouvel employé
      employees.push({
        id: Date.now(),
        nom,
        prenom,
        email,
        poste
      });
    }

    saveToStorage();
    renderEmployeeList(searchInput.value); // Mise à jour de la vue filtrée
    employeeForm.reset();
  }
});

// Suppression d’un employé
const deleteEmployee = (id) => {
  employees = employees.filter(emp => emp.id !== id);
  saveToStorage();
  renderEmployeeList(searchInput.value); // Réaffiche avec filtre actif
};

// Événement de recherche en temps réel
searchInput.addEventListener('input', (e) => {
  renderEmployeeList(e.target.value);
});

// Affichage initial
renderEmployeeList();
