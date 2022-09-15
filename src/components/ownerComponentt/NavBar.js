import './styles.css';
export default function Navbar (){
    return <nav>
        <ul>
        <li>
                <a href="/">Dashboard</a>
            </li>
            <li>
                <a href="/Properties">Properties</a>
            </li>
            <li>
                <a href="/Tenants">Tenants</a>
            </li>
            <li>
                <a href="/Maintenance">Maintenance</a>
            </li>
            <li>
                <a href="/Accounting">Accounting</a>
            </li>
            <li>
                <a href="/Reports">Reports</a>
            </li>
            <li>
                <a href="/Manager">Profile</a>
            </li>
        </ul>

    </nav>
}