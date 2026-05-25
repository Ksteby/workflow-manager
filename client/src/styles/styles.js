export const styles = {
    app: { minHeight: '100vh', padding: '20px', fontFamily: 'system-ui, sans-serif', transition: '0.3s' },
    button: { padding: '10px 15px', border: 'none', borderRadius: '8px', cursor: 'pointer', background: '#2563eb', color: 'white', fontWeight: 'bold' },
    input: { width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '8px', border: '1px solid #ccc', boxSizing: 'border-box' },
    modalOverlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 },
    modal: { background: 'white', padding: '25px', borderRadius: '12px', width: '400px', color: '#333' },
    modalField: { marginBottom: '15px', display: 'flex', flexDirection: 'column', gap: '5px' },
    modalActions: { display: 'flex', justifyContent: 'space-between', marginTop: '20px' },
    saveBtn: { padding: '8px 15px', background: '#2ecc71', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    deleteBtn: { padding: '8px 15px', background: '#e74c3c', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    closeBtn: { padding: '8px 15px', background: '#95a5a6', color: 'white', border: 'none', borderRadius: '6px', cursor: 'pointer' },
    board: { display: 'flex', gap: '20px', marginTop: '20px', overflowX: 'auto', paddingBottom: '20px' },
    column: { flex: '0 0 320px', background: '#f1f5f9', padding: '15px', borderRadius: '12px', display: 'flex', flexDirection: 'column', maxHeight: '75vh', color: '#111' },
    columnHeader: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '15px' },
    tasksContainer: { flex: 1, overflowY: 'auto', marginBottom: '10px' },
    taskCard: { background: 'white', padding: '15px', borderRadius: '10px', marginBottom: '10px', cursor: 'pointer', boxShadow: '0 2px 5px rgba(0,0,0,0.1)', color: '#111' },
    header: { display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px', padding: '20px', borderRadius: '12px' },
    authContainer: { display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' },
    authForm: { background: 'white', padding: '30px', borderRadius: '12px', width: '320px', boxShadow: '0 4px 15px rgba(0,0,0,0.1)', display: 'flex', flexDirection: 'column', color: '#111' },
    link: { color: '#2563eb', cursor: 'pointer', textAlign: 'center', marginTop: '15px', fontSize: '0.9rem' }
};

export default styles;