/// <reference types="@rbxts/testez/globals" />

import {fields, match, TypeNames, variant, VariantOf} from '.';
import {augment} from './augment';
import {payload} from './variant.tools';
import {Animal, CapsAnimal} from './__test__/animal';

export = () => {
    it('augment (inline)', () => {
        const BetterAnimal = variant(augment({
            dog: fields<{name: string, favoriteBall?: string}>(),
            cat: fields<{name: string, furnitureDamaged: number}>(),
            snake: (name: string, pattern = 'striped') => ({name, pattern}),
        }, () => ({better: 4})));
        type BetterAnimal<T extends TypeNames<typeof BetterAnimal> = undefined> = VariantOf<typeof BetterAnimal, T>;


        const snek = BetterAnimal.snake('steve');
        expect(snek.name).to.equal('steve');
        expect(snek.better).to.be.ok();
        expect(snek.better).to.equal(4);
    })

    it('augment (timestamp)', () => {
        const Action = variant(augment(
            {
                DoSomething: {},
                LoadThing: fields<{thingId: number}>(),
                RefreshPage: {},
            },
            () => ({timestamp: DateTime.now()}),
        ));
        type Action = VariantOf<typeof Action>;

        const loadAction = Action.LoadThing({thingId: 12});
    })

    it('augment (referencing pre-existing module)', () => {
        const BetterAnimal = variant(augment(Animal, () => ({better: true})));
        type BetterAnimal<T extends TypeNames<typeof BetterAnimal> = undefined> = VariantOf<typeof BetterAnimal, T>;

        const snek = BetterAnimal.snake('steve');
        expect(snek.name).to.equal('steve');
        expect(snek.better).to.be.ok();
        expect(snek.better).to.equal(true);
    })

    it('augment (referencing mismatched module)', () => {
        const BetterCapsAnimal = variant(augment(CapsAnimal, () => ({better: true})));
        const test = BetterCapsAnimal.cat({name: 'Test', furnitureDamaged: 0});

        const snek = BetterCapsAnimal.snake('steve');
        expect(snek.better).to.equal(true);
        expect(snek.name).to.equal('steve');
        expect(snek.type).to.equal('SNAKE');
    })

    it('augment (variable augment)', () => {
        const BetterAnimal = variant(augment(Animal, ({name}) => ({nameLength: name.size()})));

        const snek = BetterAnimal.snake('steve');
        expect(snek.name).to.equal('steve');
        expect(snek.type).to.equal('snake');
        expect(snek.nameLength).to.equal(5);
    })

    it('augment (conditional augment)', () => {
        const BetterAnimal = variant(augment(
            Animal,
            animal => ({
                epithet: match(animal, {
                    cat: ({furnitureDamaged}) => furnitureDamaged > 5 ? 'dangerous' : 'safe',
                    dog: ({favoriteBall}) => favoriteBall === 'yellow' ? 'bad' : 'good',
                    snake: ({pattern}) => pattern,
                })
            }),
        ));

        const snek = BetterAnimal.snake('steve');
        const pup = BetterAnimal.dog({name: 'Spot', favoriteBall: 'red'});

        expect(snek.name).to.equal('steve');
        expect(snek.epithet).to.equal('striped');
        expect(pup.name).to.equal('Spot');
        expect(pup.epithet).to.equal('good');
    })

    it('augment (conditional augment, inline match)', () => {
        const BetterAnimal = variant(augment(
            Animal,
            animal => ({
                epithet: match(animal, {
                    cat: ({furnitureDamaged}) => furnitureDamaged > 5 ? 'dangerous' : 'safe',
                    dog: ({favoriteBall}) => favoriteBall === 'yellow' ? 'bad' : 'good',
                    snake: ({pattern}) => pattern,
                })
            }),
        ));

        const snek = BetterAnimal.snake('steve');
        const pup = BetterAnimal.dog({name: 'Spot', favoriteBall: 'red'});

        expect(snek.name).to.equal('steve');
        expect(snek.epithet).to.equal('striped');
        expect(pup.name).to.equal('Spot');
        expect(pup.epithet).to.equal('good');
    })
}
