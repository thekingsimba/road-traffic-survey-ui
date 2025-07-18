import type { ErrorModel } from './types';

export const ERRORS_MESSAGES_LIST: {[statusCode:string]:ErrorModel} = {
    // using translation key as value
    // in order to display message according to user language
    '401': {
        codeMeaning: 'error401CodeMeaning',
        messageHeadline: 'error401MessageHeadline',
        messageDescription: 'error401MessageDescription'
    },
    '403': {
        codeMeaning: 'error403CodeMeaning',
        messageHeadline: 'error403MessageHeadline',
        messageDescription: 'error403MessageDescription'
    },
    '404': {
        codeMeaning: 'error404CodeMeaning',
        messageHeadline: 'error404MessageHeadline',
        messageDescription: 'error404MessageDescription'
    },
    '500': {
        codeMeaning: 'error500CodeMeaning',
        messageHeadline: 'error500MessageHeadline',
        messageDescription: 'error500MessageDescription'
    }
};

