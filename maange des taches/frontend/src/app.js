// API URL
const API_URL = 'http://localhost:5000/api/tasks';

// DOM Elements
const taskForm = document.getElementById('task-form');
const tasksList = document.getElementById('tasks');
const filterButtons = document.querySelectorAll('.filter-btn');
const modal = document.getElementById('task-modal');
const closeModal = document.querySelector('.close');
const editForm = document.getElementById('edit-form');

// Current filter
let currentFilter = 'all';

// Event Listeners
document.addEventListener('DOMContentLoaded', fetchTasks);
taskForm.addEventListener('submit', addTask);
editForm.addEventListener('submit', updateTask);
closeModal.addEventListener('click', () => modal.style.display = 'none');
window.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.style.display = 'none';
    }
});

filterButtons.forEach(button => {
    button.addEventListener('click', () => {
        filterButtons.forEach(btn => btn.classList.remove('active'));
        button.classList.add('active');
        currentFilter = button.dataset.filter;
        fetchTasks();
    });
});

// Fetch all tasks from API
async function fetchTasks() {
    try {
        const response = await fetch(API_URL);
        const tasks = await response.json();
        renderTasks(tasks);
    } catch (error) {
        console.error('Error fetching tasks:', error);
        showNotification('Erreur lors du chargement des tâches', 'error');
    }
}

// Render tasks to DOM
function renderTasks(tasks) {
    tasksList.innerHTML = '';
    
    // Filter tasks based on current filter
    const filteredTasks = currentFilter === 'all' 
        ? tasks 
        : tasks.filter(task => task.status === currentFilter);
    
    if (filteredTasks.length === 0) {
        tasksList.innerHTML = '<p>Aucune tâche trouvée</p>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskItem = document.createElement('li');
        taskItem.className = 'task-item';
        
        const statusClass = `status-${task.status}`;
        const statusText = getStatusText(task.status);
        
        taskItem.innerHTML = `
            <div class="task-info">
                <h3>${task.title}</h3>
                <p>${task.description || 'Aucune description'}</p>
                <div class="task-meta">
                    ${task.due_date ? `<span class="task-date"><i class="fas fa-calendar"></i> ${formatDate(task.due_date)}</span>` : ''}
                    <span class="task-status ${statusClass}">${statusText}</span>
                </div>
            </div>
            <div class="task-actions">
                <button class="edit-btn" data-id="${task._id}"><i class="fas fa-edit"></i></button>
                <button class="delete-btn" data-id="${task._id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        tasksList.appendChild(taskItem);
    });
    
    // Add event listeners to edit and delete buttons
    document.querySelectorAll('.edit-btn').forEach(button => {
        button.addEventListener('click', () => openEditModal(button.dataset.id));
    });
    
    document.querySelectorAll('.delete-btn').forEach(button => {
        button.addEventListener('click', () => deleteTask(button.dataset.id));
    });
}

// Add a new task
async function addTask(e) {
    e.preventDefault();
    
    const title = document.getElementById('title').value;
    const description = document.getElementById('description').value;
    const dueDate = document.getElementById('due-date').value;
    const status = document.getElementById('status').value;
    
    const task = {
        title,
        description,
        due_date: dueDate,
        status
    };
    
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        
        if (response.ok) {
            taskForm.reset();
            fetchTasks();
            showNotification('Tâche ajoutée avec succès', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Erreur lors de l\'ajout de la tâche', 'error');
        }
    } catch (error) {
        console.error('Error adding task:', error);
        showNotification('Erreur lors de l\'ajout de la tâche', 'error');
    }
}

// Open edit modal with task data
async function openEditModal(taskId) {
    try {
        const response = await fetch(`${API_URL}/${taskId}`);
        const task = await response.json();
        
        document.getElementById('edit-id').value = task._id;
        document.getElementById('edit-title').value = task.title;
        document.getElementById('edit-description').value = task.description || '';
        document.getElementById('edit-due-date').value = task.due_date ? formatDateForInput(task.due_date) : '';
        document.getElementById('edit-status').value = task.status;
        
        modal.style.display = 'block';
    } catch (error) {
        console.error('Error fetching task details:', error);
        showNotification('Erreur lors du chargement des détails de la tâche', 'error');
    }
}

// Update a task
async function updateTask(e) {
    e.preventDefault();
    
    const taskId = document.getElementById('edit-id').value;
    const title = document.getElementById('edit-title').value;
    const description = document.getElementById('edit-description').value;
    const dueDate = document.getElementById('edit-due-date').value;
    const status = document.getElementById('edit-status').value;
    
    const task = {
        title,
        description,
        due_date: dueDate,
        status
    };
    
    try {
        const response = await fetch(`${API_URL}/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(task)
        });
        
        if (response.ok) {
            modal.style.display = 'none';
            fetchTasks();
            showNotification('Tâche mise à jour avec succès', 'success');
        } else {
            const error = await response.json();
            showNotification(error.error || 'Erreur lors de la mise à jour de la tâche', 'error');
        }
    } catch (error) {
        console.error('Error updating task:', error);
        showNotification('Erreur lors de la mise à jour de la tâche', 'error');
    }
}

// Delete a task
async function deleteTask(taskId) {
    if (confirm('Êtes-vous sûr de vouloir supprimer cette tâche ?')) {
        try {
            const response = await fetch(`${API_URL}/${taskId}`, {
                method: 'DELETE'
            });
            
            if (response.ok) {
                fetchTasks();
                showNotification('Tâche supprimée avec succès', 'success');
            } else {
                const error = await response.json();
                showNotification(error.error || 'Erreur lors de la suppression de la tâche', 'error');
            }
        } catch (error) {
            console.error('Error deleting task:', error);
            showNotification('Erreur lors de la suppression de la tâche', 'error');
        }
    }
}

// Helper Functions
function getStatusText(status) {
    switch (status) {
        case 'pending':
            return 'À faire';
        case 'in-progress':
            return 'En cours';
        case 'completed':
            return 'Terminée';
        default:
            return status;
    }
}

function formatDate(dateString) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return new Date(dateString).toLocaleDateString('fr-FR', options);
}

function formatDateForInput(dateString) {
    const date = new Date(dateString);
    return date.toISOString().split('T')[0];
}

// Show notification
function showNotification(message, type) {
    // Check if notification container exists
    let container = document.querySelector('.notification-container');
    
    if (!container) {
        container = document.createElement('div');
        container.className = 'notification-container';
        document.body.appendChild(container);
        
        // Add styles
        container.style.position = 'fixed';
        container.style.top = '20px';
        container.style.right = '20px';
        container.style.zIndex = '1000';
    }
    
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.textContent = message;
    
    // Add styles
    notification.style.backgroundColor = type === 'success' ? '#2ecc71' : '#e74c3c';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '4px';
    notification.style.marginBottom = '10px';
    notification.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
    
    container.appendChild(notification);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transition = 'opacity 0.5s';
        
        setTimeout(() => {
            container.removeChild(notification);
            
            // Remove container if empty
            if (container.children.length === 0) {
                document.body.removeChild(container);
            }
        }, 500);
    }, 3000);
} 