export interface ILinkedList<T> {
    length: number

    get(index: number): T | null
    first(): T | null
    last(): T | null

    values(): Iterable<T>

    push(item: T): void
    pop(): T | null
    unshift(item: T): void
    shift(): T | null

    toObject(): Self<T>
}

type Node<T> = {
    previous: Node<T> | null
    next: Node<T> | null
    value: T
}

type Params<T> = Self<T>

type Self<T> = {
    first: Node<T> | null
    last: Node<T> | null
    length: number
}

export type EjectedLinkedList<T> = Self<T>

export const makeLinkedList = <T>(params?: Params<T>): ILinkedList<T> => {
    const self: Self<T> = params || {
        first: null,
        last: null,
        length: 0
    }

    return {
        get length() {
            return self.length
        },
        get: get(self),
        first: first(self),
        last: last(self),
        values: values(self),
        push: push(self),
        pop: pop(self),
        unshift: unshift(self),
        shift: shift(self),

        toObject: toObject(self)
    }
}

const get = <T>(self: Self<T>): ILinkedList<T>['get'] => index => {
    if (self.length === 0 || !self.first || !self.last) {
        return null
    }

    if (index < 0 || index > self.length) {
        return null
    }

    if (index > self.length / 2) {
        let current = self.last

        for (let i = index; i > 0; i--) {
            current = current.previous!
        }

        return current.value
    }

    let current = self.first

    for (let i = 0; i < index; i++) {
        current = current.next!
    }

    return current.value
}

const first = <T>(self: Self<T>): ILinkedList<T>['first'] => () => {
    return self.first?.value || null
}

const last = <T>(self: Self<T>): ILinkedList<T>['last'] => () => {
    return self.first?.value || null
}

const values = <T>(self: Self<T>): ILinkedList<T>['values'] => function* () {
    let current = self.first

    while (current) {
        yield current.value
        current = current.next
    }
}


const push = <T>(self: Self<T>): ILinkedList<T>['push'] => (value) => {
    if (!self.first || !self.last) {
        self.first = {
            next: null,
            previous: null,
            value: value
        }
        self.last = self.first
        self.length = 1

        return
    }

    self.last.next = {
        next: null,
        previous: self.last,
        value: value
    }
    self.last = self.last.next
    self.length += 1
}

const pop = <T>(self: Self<T>): ILinkedList<T>['pop'] => () => {
    if (!self.first || !self.last) {
        return null
    }


    if (self.last.previous === null) {
        self.first = null
        self.last = null
        self.length = 0
        return null
    }

    const value = self.last.value

    self.last = self.last.previous
    self.last.next = null
    self.length -= 1

    return value
}


const unshift = <T>(self: Self<T>): ILinkedList<T>['unshift'] => (value) => {
    if (!self.first || !self.last) {
        self.first = {
            next: null,
            previous: null,
            value: value
        }
        self.last = self.first
        self.length = 1

        return
    }

    self.first.previous = {
        next: self.first,
        previous: null,
        value: value
    }
    self.first = self.first.previous
    self.length += 1
}

const shift = <T>(self: Self<T>): ILinkedList<T>['shift'] => () => {
    if (!self.first || !self.last) {
        return null
    }


    if (self.first.next === null) {
        self.first = null
        self.last = null
        self.length = 0
        return null
    }

    const value = self.first.value

    self.first = self.first.next
    self.first.previous = null
    self.length -= 1

    return value
}

const toObject = <T>(self: Self<T>): ILinkedList<T>['toObject'] => () => {
    return self
}