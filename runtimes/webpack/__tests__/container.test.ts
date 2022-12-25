import { join } from "path";
import { Injex } from "../src";
import { MailService } from "./__mocks__/project/mailService";
import makeRequireWithContext, { RequireWithContext } from "./__mocks__/requireWithContext";

describe('InjexWebpackContainer', () => {

    let $require: RequireWithContext;
    beforeEach(() => {
        $require = makeRequireWithContext();
    });

    it('should load modules', async () => {
        const container = Injex.create({
            resolveContext: () => $require.context(join(__dirname, './__mocks__/project'), true, /\.ts$/)
        });

        await container.bootstrap();

        const [mailService, store] = container.get('mailService', 'store');

        expect(mailService).toBeDefined();
        expect(mailService).toBeInstanceOf(MailService);

        expect(store).toBeDefined();
        expect(store.Id).toEqual('123');
    });
});