from flask import request, jsonify
from app import app, db
from bson.objectid import ObjectId

# Get all tasks
@app.route('/api/tasks', methods=['GET'])
def get_tasks():
    tasks = list(db.tasks.find())
    for task in tasks:
        task['_id'] = str(task['_id'])
    return jsonify(tasks)

# Get a specific task
@app.route('/api/tasks/<task_id>', methods=['GET'])
def get_task(task_id):
    task = db.tasks.find_one({'_id': ObjectId(task_id)})
    if task:
        task['_id'] = str(task['_id'])
        return jsonify(task)
    return jsonify({'error': 'Task not found'}), 404

# Create a new task
@app.route('/api/tasks', methods=['POST'])
def create_task():
    task_data = request.json
    if not task_data or 'title' not in task_data:
        return jsonify({'error': 'Title is required'}), 400
    
    new_task = {
        'title': task_data['title'],
        'description': task_data.get('description', ''),
        'status': task_data.get('status', 'pending'),
        'due_date': task_data.get('due_date')
    }
    
    result = db.tasks.insert_one(new_task)
    new_task['_id'] = str(result.inserted_id)
    
    return jsonify(new_task), 201

# Update a task
@app.route('/api/tasks/<task_id>', methods=['PUT'])
def update_task(task_id):
    task_data = request.json
    if not task_data:
        return jsonify({'error': 'No data provided'}), 400
    
    db.tasks.update_one(
        {'_id': ObjectId(task_id)},
        {'$set': task_data}
    )
    
    updated_task = db.tasks.find_one({'_id': ObjectId(task_id)})
    if updated_task:
        updated_task['_id'] = str(updated_task['_id'])
        return jsonify(updated_task)
    
    return jsonify({'error': 'Task not found'}), 404

# Delete a task
@app.route('/api/tasks/<task_id>', methods=['DELETE'])
def delete_task(task_id):
    result = db.tasks.delete_one({'_id': ObjectId(task_id)})
    
    if result.deleted_count > 0:
        return jsonify({'message': 'Task deleted successfully'})
    
    return jsonify({'error': 'Task not found'}), 404 