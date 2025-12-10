const { expect } = require('chai');
const sinon = require('sinon');

const AuthService = require('../../app/Services/AuthService');

describe('AuthService', () => {
    let userRepositoryStub;
    let userModelStub;
    let authService;

    beforeEach(() => {
        userRepositoryStub = {
            findByEmail: sinon.stub(),
            create: sinon.stub(),
        };

        userModelStub = {};

        authService = new AuthService(userRepositoryStub, userModelStub);
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('register', () => {
        it('devrait créer un user et retourner un token si email unique', async () => {
            const fakeUser = {
                email: 'unique@mail.com',
                generateAuthToken: sinon.stub().resolves('jwt-token'),
            };

            userRepositoryStub.findByEmail.resolves(null);
            userRepositoryStub.create.resolves(fakeUser);

            const result = await authService.register({ email: fakeUser.email, password: 'pass' });

            expect(userRepositoryStub.findByEmail.calledOnceWith(fakeUser.email)).to.be.true;
            expect(userRepositoryStub.create.calledOnce).to.be.true;
            expect(fakeUser.generateAuthToken.calledOnce).to.be.true;
            expect(result).to.deep.equal({ user: fakeUser, token: 'jwt-token' });
        });

        it('devrait lancer une erreur 409 si utilisateur existe déjà', async () => {
            userRepositoryStub.findByEmail.resolves({ id: 'exists' });

            try {
                await authService.register({ email: 'dup@mail.com', password: 'pass' });
                throw new Error('should have thrown');
            } catch (error) {
                expect(error).to.be.instanceOf(Error);
                expect(error.status).to.equal(409);
            }
        });
    });

    describe('login', () => {
        it('devrait retourner un token si user existe et mot de passe valide', async () => {
            const fakeUser = {
                comparePassword: sinon.stub().resolves(true),
                generateAuthToken: sinon.stub().resolves('jwt-token'),
            };

            userRepositoryStub.findByEmail.resolves(fakeUser);

            const result = await authService.login('mail@test.com', 'pass');

            expect(userRepositoryStub.findByEmail.calledOnceWith('mail@test.com')).to.be.true;
            expect(fakeUser.comparePassword.calledOnceWith('pass')).to.be.true;
            expect(fakeUser.generateAuthToken.calledOnce).to.be.true;
            expect(result).to.deep.equal({ user: fakeUser, token: 'jwt-token' });
        });

        it('devrait lancer une erreur 401 si user inexistant', async () => {
            userRepositoryStub.findByEmail.resolves(null);

            try {
                await authService.login('unknown@mail.com', 'pass');
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(401);
            }
        });

        it('devrait lancer une erreur 401 si mot de passe invalide', async () => {
            const fakeUser = {
                comparePassword: sinon.stub().resolves(false),
            };

            userRepositoryStub.findByEmail.resolves(fakeUser);

            try {
                await authService.login('mail@test.com', 'wrong');
                throw new Error('should have thrown');
            } catch (error) {
                expect(fakeUser.comparePassword.calledOnceWith('wrong')).to.be.true;
                expect(error.status).to.equal(401);
            }
        });
    });
});

