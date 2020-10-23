import { useInjex } from "@injex/react-plugin";
import Search from "components/search";
import { AuthManager } from "managers/authManager";
import { PresenceManager } from "managers/presenceManager";
import * as React from "react";
import theme from "./theme.scss";
import User from "./user";

export default function Users(): JSX.Element {
    const [inject] = useInjex();
    const [filter, setFilter] = React.useState("");
    const onFilterChange = React.useCallback((value) => setFilter(value), []);
    const authManager = inject<AuthManager>("authManager");
    const presenceManager = inject<PresenceManager>("presenceManager");
    const users = React.useMemo(() => {
        if (filter) {
            const lowerCasedFilter = filter.toLowerCase();
            return presenceManager.allUsers.filter((user) => user.name.toLowerCase().indexOf(lowerCasedFilter) > -1);
        }

        return presenceManager.allUsers;
    }, [filter, presenceManager.allUsers]);

    return (
        <div className={theme.users}>
            <div className={theme.filter}>
                <Search onFilter={onFilterChange} placeholder="Search for user" />
            </div>
            <div className={theme.currentUser}>
                <User presence="online" user={authManager.user} />
                <div className={theme.menu}>
                    <button onClick={authManager.logout}><i className="material-icons">exit_to_app</i></button>
                </div>
            </div>
            <div className={theme.list}>
                {users.map((user) => <User key={user.id} presence={user.presence} user={user} />)}
            </div>
            <div className={theme.online}>
                {presenceManager.onlineCount} Online
            </div>
        </div>
    );
}