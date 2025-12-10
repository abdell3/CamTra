const { expect } = require('chai');
const sinon = require('sinon');

const UserService = require('../../app/Services/UserService');

describe('UserService', () => {
    let userRepositoryStub;
    let userService;

    beforeEach(() => {
        userRepositoryStub = {
            findByRole: sinon.stub(),
            create: sinon.stub(),
            findById: sinon.stub(),
            delete: sinon.stub(),
            update: sinon.stub(),
        };

        userService = new UserService(userRepositoryStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('getAllDrivers', () => {
        it('devrait appeler findByRole avec "Chauffeur"', async () => {
            const fakeDrivers = [
                { id: '1', email: 'driver1@test.com', role: 'Chauffeur' },
                { id: '2', email: 'driver2@test.com', role: 'Chauffeur' },
            ];

            userRepositoryStub.findByRole.resolves(fakeDrivers);

            const result = await userService.getAllDrivers();

            expect(userRepositoryStub.findByRole.calledOnceWith('Chauffeur')).to.be.true;
            expect(result).to.deep.equal(fakeDrivers);
        });
    });

    describe('createDriver', () => {
        it('devrait créer un chauffeur en forçant le rôle "Chauffeur"', async () => {
            const inputData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'driver@test.com',
                password: 'password123',
            };

            const fakeDriver = {
                ...inputData,
                role: 'Chauffeur',
                id: '123',
            };

            userRepositoryStub.create.resolves(fakeDriver);

            const result = await userService.createDriver(inputData);

            expect(userRepositoryStub.create.calledOnce).to.be.true;
            const createCall = userRepositoryStub.create.getCall(0);
            expect(createCall.args[0]).to.have.property('role', 'Chauffeur');
            expect(createCall.args[0]).to.have.property('firstName', 'John');
            expect(createCall.args[0]).to.have.property('email', 'driver@test.com');
            expect(result).to.deep.equal(fakeDriver);
        });
    });

    describe('deleteUser', () => {
        it('devrait supprimer un utilisateur si il existe', async () => {
            const userId = '123';
            const fakeUser = { id: userId, email: 'user@test.com' };

            userRepositoryStub.findById.resolves(fakeUser);
            userRepositoryStub.delete.resolves(fakeUser);

            const result = await userService.deleteUser(userId);

            expect(userRepositoryStub.findById.calledOnceWith(userId)).to.be.true;
            expect(userRepositoryStub.delete.calledOnceWith(userId)).to.be.true;
            expect(result).to.deep.equal(fakeUser);
        });

        it('devrait lancer une erreur 404 si utilisateur n\'existe pas', async () => {
            const userId = '999';

            userRepositoryStub.findById.resolves(null);

            try {
                await userService.deleteUser(userId);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
                expect(error.status).to.equal(404);
                expect(error.message).to.equal('User not found');
                expect(userRepositoryStub.findById.calledOnceWith(userId)).to.be.true;
                expect(userRepositoryStub.delete.called).to.be.false;
            }
        });
    });

    describe('updateUser', () => {
        it('devrait mettre à jour un utilisateur si il existe', async () => {
            const userId = '123';
            const existingUser = { id: userId, email: 'user@test.com', firstName: 'Old' };
            const updateData = { firstName: 'New', lastName: 'Name' };
            const updatedUser = { ...existingUser, ...updateData };

            userRepositoryStub.findById.resolves(existingUser);
            userRepositoryStub.update.resolves(updatedUser);

            const result = await userService.updateUser(userId, updateData);

            expect(userRepositoryStub.findById.calledOnceWith(userId)).to.be.true;
            expect(userRepositoryStub.update.calledOnce).to.be.true;
            expect(userRepositoryStub.update.calledWith(userId, updateData)).to.be.true;
            expect(result).to.deep.equal(updatedUser);
        });

        it('devrait supprimer le password des données de mise à jour', async () => {
            const userId = '123';
            const existingUser = { id: userId, email: 'user@test.com' };
            const updateData = {
                firstName: 'New',
                password: 'shouldBeRemoved',
            };

            userRepositoryStub.findById.resolves(existingUser);
            userRepositoryStub.update.resolves({ ...existingUser, firstName: 'New' });

            await userService.updateUser(userId, updateData);

            const updateCall = userRepositoryStub.update.getCall(0);
            expect(updateCall.args[1]).to.not.have.property('password');
            expect(updateCall.args[1]).to.have.property('firstName', 'New');
        });

        it('devrait lancer une erreur 404 si utilisateur n\'existe pas', async () => {
            const userId = '999';
            const updateData = { firstName: 'New' };

            userRepositoryStub.findById.resolves(null);

            try {
                await userService.updateUser(userId, updateData);
                throw new Error('should have thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
                expect(error.status).to.equal(404);
                expect(error.message).to.equal('User not found');
                expect(userRepositoryStub.findById.calledOnceWith(userId)).to.be.true;
                expect(userRepositoryStub.update.called).to.be.false;
            }
        });
    });
});

