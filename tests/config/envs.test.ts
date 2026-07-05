
const ORIGINAL_ENV = { ...process.env };

// Evita que "dotenv/config" pise las variables que definimos manualmente
// en cada test al intentar leer un archivo .env real del disco.
vi.mock('dotenv/config', () => ({}));

describe('envs', () => {

    beforeEach(() => {
        vi.resetModules();
        process.env = { ...ORIGINAL_ENV };
    });

    afterEach(() => {
        process.env = { ...ORIGINAL_ENV };
    });

    it('carga los valores desde las variables de entorno', async () => {
        process.env.POSTGRES_URL = 'postgres://user:pass@localhost:5432/db';
        process.env.PUBLIC_PATH = './public';
        process.env.PORT = '4000';

        const { envs } = await import('../../src/config/envs.ts');

        expect(envs.postgresUrl).toBe('postgres://user:pass@localhost:5432/db');
        expect(envs.publicPath).toBe('./public');
        expect(envs.port).toBe(4000);
    });

    it('usa el puerto 3000 por defecto cuando PORT no esta definido', async () => {
        process.env.POSTGRES_URL = 'postgres://user:pass@localhost:5432/db';
        process.env.PUBLIC_PATH = './public';
        delete process.env.PORT;

        const { envs } = await import('../../src/config/envs.ts');

        expect(envs.port).toBe(3000);
    });

    it('lanza un error cuando falta una variable requerida (POSTGRES_URL)', async () => {
        delete process.env.POSTGRES_URL;
        process.env.PUBLIC_PATH = './public';

        await expect(import('../../src/config/envs.ts')).rejects.toThrow(/Config validation error/);
    });

    it('lanza un error cuando falta una variable requerida (PUBLIC_PATH)', async () => {
        process.env.POSTGRES_URL = 'postgres://user:pass@localhost:5432/db';
        delete process.env.PUBLIC_PATH;

        await expect(import('../../src/config/envs.ts')).rejects.toThrow(/Config validation error/);
    });

});