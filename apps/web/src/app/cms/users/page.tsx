import {getUsers} from '@/lib/api/actions';
import {Switch} from '@/components/ui/switch';


const UserList = async () => {
    const users = await getUsers();
    return (
        <div>
            <h2>User List</h2>
            <ul>
                {users.map(({username, id, settings, posts}) => <li key={id}>{username}
                    {settings
                        ? (typeof settings.receiveEmails) === 'boolean'
                            ? <Switch checked={settings.receiveEmails}/>
                            : null
                        : null}
                    {
                        posts
                            ? <ul>
                                {posts.map(({title, id}) => <li key={id}>{title}</li>)}
                            </ul>
                            : null
                    }
                </li>)}
            </ul>
        </div>
    );
};

export default UserList;
