import { generateUID } from '../../utils/utils';
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express';

export type Todo = {
    id: string,
    title: string,
    completed: boolean
}


//mimic database, this will reset when we reset the server
let todos: Todo[] = []


const todoRoutes = express.Router();
todoRoutes.use(bodyParser.json())


//get all todos
todoRoutes.get('/', (_req: Request, res: Response): void => {
    res.json(todos);
});

//get todo by id, we pass variable url by this syntax :varName
todoRoutes.get('/:id', (req: Request, res: Response): void => {
    const todo: Todo | undefined = todos.find(t => t.id == req.params.id)
    if (todo) {
        res.json(todo)
    }
    else {
        res.status(404).send('resource not found')
    }
});

//post todo, adds a new todo
todoRoutes.post('/', (req: Request, res: Response): void => {
    const title: string | undefined = req.body.title

    //ensure title validity
    if (title && typeof title == 'string') {
        const newTodo: Todo = {
            id: generateUID(),
            title,
            completed: false
        }
        todos.push(newTodo)
        res.json(newTodo)
    }
    else {
        res.status(400).send("bad request")
    }
})

//edit a resource
todoRoutes.patch('/:id', (req: Request, res: Response): void => {
    const todo: Todo | undefined = todos.find(t => t.id == req.params.id)
    //ensure todo is found
    if (todo) {
        const title: string | undefined = req.body.title
        const completed: boolean | undefined = req.body.completed

        //no title or completed sent to edit
        if (!("title" in req.body || "completed" in req.body)) {
            res.status(400).send("missing parameters")
        }
        //title is sent but not as a string
        else if ("title" in req.body && typeof title != "string") {
            res.status(400).send("title must be a string")
        }
        //completed is sent but not as a boolean
        else if ("completed" in req.body && typeof completed != "boolean") {
            res.status(400).send("completed must be a boolean")
        }
        else {

            //if title is in body, set todo.title to the new title
            if ('title' in req.body) {
                todo.title = title as string
            }
            //if completed is in body, set todo.completed to the new status
            if ('completed' in req.body) {
                todo.completed = completed as boolean
            }
            todos = todos.map(t => {
                if (t.id === todo.id) {
                    return todo
                }
                return t
            })
            res.json(todos)
        }
    }
    else {
        res.status(404).send('resource not found')
    }
})

//delete a resouce
todoRoutes.delete('/:id', (req: Request, res: Response): void => {
    const todo: Todo | undefined = todos.find(t => t.id == req.params.id)
    if (todo) {
        todos = todos.filter(t => t.id !== todo.id)
        res.sendStatus(204)
    }
    else {
        res.status(404).send('resource not found')
    }
});

export default todoRoutes;
