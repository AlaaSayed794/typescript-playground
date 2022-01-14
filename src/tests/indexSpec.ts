//your tests
import supertest from 'supertest';
import app from '../index';
import { Todo } from '../routes/todos';

const request = supertest(app);

const jsonHeaders = {
    Accept: 'application/json',
    'Content-Type': 'application/json'
};

describe('Test endpoint responses', () => {
    type newTodo = {
        title: string
    }
    let createdTodo: Todo | undefined
    const newTodo: newTodo = {
        title: "new todo"
    }

    beforeEach(() => {
        console.log("before each")
    });
    beforeAll(() => {
        console.log("before all")
    });
    afterEach(() => {
        console.log("after each")
    });
    afterAll(() => {
        console.log("after all")
    });


    it('tests the main endpoint', async () => {
        const response = await request.get('/');
        expect(response.status).toBe(200);
        expect(response.text).toBe(
            'todo app root route'
        );
    });

    it('tests the api endpoint', async () => {
        const response = await request.get('/api');
        expect(response.status).toBe(200);
        expect(response.text).toBe(
            'API route'
        );
    });

    it('test todos route post', async () => {
        const response = await request
            .post('/api/todos')
            .set(jsonHeaders)
            .send(newTodo);
        expect(response.status).toBe(200);
        createdTodo = response.body as Todo
        expect(createdTodo.title).toEqual(newTodo.title);
        expect("id" in createdTodo).toBeTruthy()
        expect(createdTodo.completed).toBeFalsy();
    });

    it('test todos route get all', async () => {
        const response = await request.get("/api/todos")

        expect(response.status).toBe(200);
        const todos: Todo[] = response.body as Todo[]
        expect(todos.length).toEqual(1)
        expect(Array.isArray(todos)).toBeTruthy()
        expect((createdTodo as Todo).title).toEqual(todos[0].title);
        expect((createdTodo as Todo).id).toEqual(todos[0].id);
        expect(todos[0].completed).toBeFalsy();
    })

    it('test todos route get specific todo', async () => {
        const response = await request.get("/api/todos/" + (createdTodo as Todo).id)
        expect(response.status).toBe(200);
        const returnedTodo: Todo = response.body as Todo
        expect((createdTodo as Todo).title).toEqual(returnedTodo.title);
        expect((createdTodo as Todo).id).toEqual(returnedTodo.id);
        expect(returnedTodo.completed).toBeFalsy();
    })

    it('test todos delete method', async () => {
        const response = await request.delete("/api/todos/" + (createdTodo as Todo).id)
        expect(response.status).toBe(204);
        const newResponse = await request.get("/api/todos")
        const todos: Todo[] = newResponse.body as Todo[]
        expect(todos.length).toEqual(0)
        expect(Array.isArray(todos)).toBeTruthy()
    })



});