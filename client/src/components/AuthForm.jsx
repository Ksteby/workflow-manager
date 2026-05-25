import { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { styles } from '../styles/styles';

function AuthForm({ onLogin }) {
    const [isRegistering, setIsRegistering] = useState(false);
    const [formData, setFormData] = useState({ name: '', password: '' });
    const [inviteToken, setInviteToken] = useState(null);

    // We capture the invitation from the URL o the sessionStorage
    useEffect(() => {
        const params = new URLSearchParams(window.location.search);
        const urlInvite = params.get('invite');
        const sessionInvite = sessionStorage.getItem("pendingInvite");
        
        if (urlInvite) {
            setInviteToken(urlInvite);
            window.history.replaceState({}, document.title, window.location.pathname);
        } else if (sessionInvite) {
            setInviteToken(sessionInvite);
        }
    }, []);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        sessionStorage.removeItem("flowUser");

        try {
            const endpoint = isRegistering 
                ? 'http://localhost:5000/api/auth/register' 
                : 'http://localhost:5000/api/auth/login';

            // WE SENS THE INVITATION DIRECTLY TO THE SERVER HERE
            const payload = {
                ...formData,
                invite: inviteToken
            };

            const response = await fetch(endpoint, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(payload)
            });

            const data = await response.json();

            if (!response.ok) {
                throw new Error(data.error || "An error has occured.");
            }

            // cleaning
            sessionStorage.removeItem("pendingInvite");

            toast.success(isRegistering ? 'Account created successfully!' : 'Logged in successfully!');
            
            // we connect the user
            sessionStorage.setItem('flowUser', JSON.stringify(data));
            onLogin(data);

        } catch (error) {
            toast.error(error.message);
        }
    };

    return (
        <div style={styles.authContainer}>
            <form onSubmit={handleSubmit} style={styles.authForm}>
                <h2>{isRegistering ? 'Create account' : 'Connexion'}</h2>
                
                {inviteToken && (
                    <div style={{ background: '#e0f2fe', color: '#0369a1', padding: '10px', borderRadius: '6px', marginBottom: '15px', fontSize: '0.85rem', textAlign: 'center' }}>
                        👋 You have been invited to join a team! Log in or sign up to continue.
                        <br />
                    </div>
                )}
                
                <input type="text" name="name" placeholder="Nom d'utilisateur" value={formData.name} onChange={handleChange} style={styles.input} required />
                <input type="password" name="password" placeholder="Mot de passe" value={formData.password} onChange={handleChange} style={styles.input} required />

                <button type="submit" style={styles.button}>
                    {isRegistering ? 'Sign up' : 'Sign in'}
                </button>

                <p style={styles.link} onClick={() => setIsRegistering(!isRegistering)}>
                    {isRegistering ? 'Already have an account':'Login' ? 'Don\'t have an account': 'Sign up'}
                </p>
            </form>
        </div>
    );
}

export default AuthForm;