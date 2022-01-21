import { generateUID } from '../../utils/utils';
import bodyParser from 'body-parser'
import express, { Request, Response } from 'express';

export type Todo = {
    id: string,
    title: string,
    completed: boolean
}


//mimic database, this will reset when we reset the server
let todos: Todo[] = [
    {
        "id": "1g0td444lqajs4ami0rwuq",
        "title": "new todo",
        "completed": false
    }, {
        "id": "7zjk3o65p36xo0b16446w",
        "title": "new todo1",
        "completed": true
    },
    {
        "id": "7w5peg740enr2zi4f3gid",
        "title": "new todo2",
        "completed": false
    }, {
        "id": "cwpmt6fl5g6oizhq6d8qo",
        "title": "new todo3",
        "completed": true
    }
]


const todoRoutes = express.Router();
todoRoutes.use(bodyParser.json())


//get all todos
//now we will allow 3 query parameters , completed = true/false , limit=number, sort=asc/dec
// if completed,limit are corrupted we will just not filter
// if sort is corrupted,we send a bad request , just to show both scenarios
todoRoutes.get('/', (req: Request, res: Response): void => {
    //this is a number or NaN , NaN evaluates to false
    const limit: number = parseInt(req.query.limit as string)

    //this is a string that accepts true/false
    const completed: string = req.query.completed as string

    const sortQuery: string = req.query.sort as string

    //define a boolean|undefined variable, initially undefined
    let completedBool: boolean | undefined;
    //this is the todos we're going to return, initially = all todos
    let newTodos = todos

    //if limit is defined then it is a number,
    // 0 evaluates to false but we want to allow user to return 0 todos (just for illustration) so we Or it with the check
    if (limit || limit === 0) {
        //if limit >= length then we don't need to filter
        if (limit < newTodos.length) {
            //
            newTodos = newTodos.slice(0, limit)
        }
    }

    if (!(typeof completed == "undefined")) {
        if (completed.toLowerCase() == 'true') {
            completedBool = true
        }
        else if (completed.toLowerCase() == 'false') {
            completedBool = false
        }
    }
    if (!(typeof completedBool == "undefined")) {
        newTodos = newTodos.filter(t => t.completed === completedBool)
    }

    if (!(typeof sortQuery == "undefined")) {
        if (sortQuery.toLowerCase() !== "asc" && sortQuery.toLowerCase() !== "dec") {
            res.status(400).send('sort accepts only asc/dec case insensitive')
        }
        else {
            //sort todos by title
            newTodos = newTodos.sort((b, a) => {
                // decide which is first in condition based on sort method
                const first: Todo = sortQuery.toLowerCase() === "asc" ? b : a
                let second: Todo = sortQuery.toLowerCase() === "asc" ? a : b
                if (first.title > second.title) {
                    return 1
                }
                else if (first.title < second.title) {
                    return -1
                }
                return 0
            })
        }
    }

    res.json(newTodos);
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
