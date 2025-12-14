const { expect } = require('chai');
const sinon = require('sinon');
const jwt = require('jsonwebtoken');

const AuthService = require('../../app/Services/AuthService');

describe('AuthService', () => {
    let userRepositoryStub;
    let userModelStub;
    let authService;

    beforeEach(() => {
        userRepositoryStub = {
            findByEmail: sinon.stub(),
            create: sinon.stub(),
            findById: sinon.stub(),
        };

        userModelStub = {};

        authService = new AuthService(userRepositoryStub, userModelStub);

        process.env.JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'test-refresh-secret';
    });

    afterEach(() => {
        sinon.restore();
    });

    describe('register', () => {
        it('devrait créer un user et retourner access & refresh tokens si email unique', async () => {
            const fakeUser = {
                email: 'unique@mail.com',
                generateAccessToken: sinon.stub().resolves('access-token'),
                generateRefreshToken: sinon.stub().resolves('refresh-token'),
            };

            userRepositoryStub.findByEmail.resolves(null);
            userRepositoryStub.create.resolves(fakeUser);

            const result = await authService.register({ email: fakeUser.email, password: 'pass' });

            expect(userRepositoryStub.findByEmail.calledOnceWith(fakeUser.email)).to.be.true;
            expect(userRepositoryStub.create.calledOnce).to.be.true;
            expect(fakeUser.generateAccessToken.calledOnce).to.be.true;
            expect(fakeUser.generateRefreshToken.calledOnce).to.be.true;
            expect(result).to.deep.equal({ user: fakeUser, accessToken: 'access-token', refreshToken: 'refresh-token' });
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
        it('devrait retourner access & refresh tokens si user existe et mot de passe valide', async () => {
            const fakeUser = {
                comparePassword: sinon.stub().resolves(true),
                generateAccessToken: sinon.stub().resolves('access-token'),
                generateRefreshToken: sinon.stub().resolves('refresh-token'),
            };

            userRepositoryStub.findByEmail.resolves(fakeUser);

            const result = await authService.login('mail@test.com', 'pass');

            expect(userRepositoryStub.findByEmail.calledOnceWith('mail@test.com')).to.be.true;
            expect(fakeUser.comparePassword.calledOnceWith('pass')).to.be.true;
            expect(fakeUser.generateAccessToken.calledOnce).to.be.true;
            expect(fakeUser.generateRefreshToken.calledOnce).to.be.true;
            expect(result).to.deep.equal({ user: fakeUser, accessToken: 'access-token', refreshToken: 'refresh-token' });
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

    describe('refreshToken', () => {
        it('devrait retourner de nouveaux tokens si refreshToken est valide', async () => {
            const fakeUser = {
                generateAccessToken: sinon.stub().resolves('new-access'),
                generateRefreshToken: sinon.stub().resolves('new-refresh'),
            };

            sinon.stub(jwt, 'verify').callsFake((token, secret, cb) => cb(null, { id: '123' }));
            userRepositoryStub.findById.resolves(fakeUser);

            const result = await authService.refreshToken('valid-refresh');

            expect(jwt.verify.calledOnce).to.be.true;
            expect(userRepositoryStub.findById.calledOnceWith('123')).to.be.true;
            expect(fakeUser.generateAccessToken.calledOnce).to.be.true;
            expect(fakeUser.generateRefreshToken.calledOnce).to.be.true;
            expect(result).to.deep.equal({ accessToken: 'new-access', refreshToken: 'new-refresh' });
        });

        it('devrait lancer une erreur 403 si refreshToken est invalide/expiré', async () => {
            sinon.stub(jwt, 'verify').callsFake((token, secret, cb) => cb(new Error('invalid')));

            try {
                await authService.refreshToken('bad-token');
                throw new Error('should have thrown');
            } catch (error) {
                expect(error.status).to.equal(403);
            }
        });
    });
});

