import React, { useState, ChangeEvent } from 'react'

export const NewTodoForm: React.FC<{
    addTodo: Function
}> = (props) => {

    const [description, setDescription] = useState('');
    const [assigned, setAssigned] = useState('');

    const descriptionChange = (event: ChangeEvent<HTMLTextAreaElement>) => {
        setDescription(event.target.value);
    };

    const assignedChange = (event: ChangeEvent<HTMLInputElement>) => {
        setAssigned(event.target.value);
    };

    const submitTodo = () => {
        if (description === '' || assigned === '') {
            alert('Please enter a description and assignee');
        }
        else {
            props.addTodo(description, assigned);
            setDescription('');
            setAssigned('');

            alert('Todo added');
        }
    }

    return (
        <div className='mt-5'>
            <form>
                <div className='mb-3'>
                    <label className='form-label'>Assigned</label>
                    <input
                        type='text'
                        className='form-control'
                        required
                        onChange={assignedChange}
                        value={assigned}
                    />
                </div>
                <div className='mb-3'>
                    <label className='form-label'>Description</label>
                    <textarea
                        className='form-control'
                        rows={3}
                        required
                        onChange={descriptionChange}
                        value={description}
                    />
                </div>
                <button type='button' className='btn btn-primary mt-3' onClick={submitTodo}>
                    Add Todo
                </button>
            </form>
        </div>
    )
}
