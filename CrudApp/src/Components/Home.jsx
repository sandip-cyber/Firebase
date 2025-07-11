import { useEffect, useState } from 'react'
import db from './firebase';
import { collection, addDoc, getDocs } from 'firebase/firestore';
import axios from "axios"

const Home = () => {
    const [users, setUsers] = useState([]);
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [imageUrl, setImageUrl] = useState("");

    const handleChange = async (e) => {
        const file = e.target.files[0];
        if (!file) return;
        const data = new FormData();
        data.append("file", file);
        data.append("upload_preset", "images"); // corrected field name

        try {
            const res = await axios.post(
                `https://api.cloudinary.com/v1_1/dbx3bsk7i/image/upload`, // corrected URL
                data
            );
            console.log("Upload Success");
            setImageUrl(res.data.secure_url);
        } catch (error) {
            console.error("Upload Failed", error);
        }
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        const data = { name, email, imageUrl }; // include imageUrl
        await addDoc(collection(db, "users"), data);
        setName('');
        setEmail('');
        setImageUrl('');
        fetchUsers();
    };

    const fetchUsers = async () => {
        const show = await getDocs(collection(db, "users"));
        const userList = show.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setUsers(userList);
    };

    useEffect(() => {
        fetchUsers();
    }, []);

    return (

<h1>This for testing in Image and data send(Firebase and Cloudinary) <h1/>
        <div>
            <form onSubmit={handleSubmit}>
               
                <input type="file"
                    name='image'
                    onChange={handleChange}
                />
                <input
                    name='name'
                    placeholder='Name'
                    onChange={(e) => setName(e.target.value)}
                    value={name}
                />
                <input
                    name='email'
                    placeholder='Email'
                    onChange={(e) => setEmail(e.target.value)}
                    value={email}
                />
                <button type='submit'>Submit</button>
            </form>

            <h3>Show User</h3>
            <ul>
                {users.map(user => (
                    <li key={user.id}>
                        {user.name} ({user.email})
                        {user.imageUrl && (
                            <img src={user.imageUrl} alt="" width="150" />
                        )}
                    </li>
                ))}
            </ul>
        </div>
    )
}

export default Home

