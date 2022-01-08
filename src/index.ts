//class access modifiers
class Person {
    public name: string//public is the default
    static classProp: number = 3
    private privateProp: number | undefined
    protected protectedProp: number | undefined
    constructor(name: string) {
        this.name = name
    }
}
class Employee extends Person {
    display(): void {
        console.log(this.name)
        console.log(this.protectedProp)

        //Property 'privateProp' is private and only accessible within class 'Person'
        //  console.log(this.privateProp)

        //Property 'classProp' does not exist on type 'Employee'. Did you mean to access the static member 'Employee.classProp' instead?
        //console.log(this.classProp)

    }
}

const e = new Employee("Ahmed")
e.display()

console.log(e.name)
//Property 'protectedProp' is protected and only accessible within class 'Person' and its subclasses
//console.log(e.protectedProp)

//Property 'privateProp' is private and only accessible within class 'Person'.
//console.log(e.privateProp)

//Property 'classProp' does not exist on type 'Employee'. Did you mean to access the static member 'Employee.classProp' instead?
//console.log(e.classProp)
console.log(Person.classProp)
console.log(Employee.classProp)

