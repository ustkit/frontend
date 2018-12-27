import Home from 'components/Home';
import Collection from 'components/Collection';
import Cabinet from 'components/Cabinet';
import NotFound from 'components/NotFound';

export default [
    {
        path: '/',
        component: Home,
        exact: true
    },
    {
        path: '/cabinet',
        component: Cabinet,
        exact: true
    },
    {
        path: '/collection/:hash?',
        component: Collection,
        exact: true
    },
    {
        path: '/not-found',
        component: NotFound,
        exact: true
    },
    {
        path: '*',
        component: NotFound,
        exact: true
    }
]
