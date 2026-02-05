import type { UserConfig } from '@commitlint/types';

const config: UserConfig = {
    extends: ['@commitlint/config-conventional'],
    rules: {
        'type-enum': [
            2,
            'always',
            [
                'feat', // Nova funcionalidade
                'fix', // Correção de bug
                'docs', // Documentação
                'style', // Formatação (não afeta código)
                'refactor', // Refatoração
                'perf', // Performance
                'test', // Testes
                'build', // Build system
                'ci', // CI/CD
                'chore', // Tarefas gerais
                'revert', // Reverter commit
            ],
        ],
        'type-case': [2, 'always', 'lower-case'],
        'type-empty': [2, 'never'],
        'subject-empty': [2, 'never'],
        'subject-case': [2, 'always', 'lower-case'],
        'subject-full-stop': [2, 'never', '.'],
        'header-max-length': [2, 'always', 100],
    },
};

export default config;
