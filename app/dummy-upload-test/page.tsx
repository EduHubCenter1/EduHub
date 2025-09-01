'use client';

import { useState, FormEvent } from 'react';

export default function DummyUploadTestPage() {
  const [file, setFile] = useState<File | null>(null);
  const [message, setMessage] = useState<string>('');
  const [uploading, setUploading] = useState<boolean>(false);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      setFile(e.target.files[0]);
      setMessage('');
    }
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!file) {
      setMessage("Veuillez d'abord sélectionner un fichier.");
      return;
    }

    setUploading(true);
    setMessage('Envoi en cours...');

    const formData = new FormData();
    formData.append('file', file);

    try {
      const response = await fetch('/api/dummy-upload', {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (response.ok) {
        setMessage(`Upload réussi ! Fichier disponible à : ${data.url}`);
      } else {
        setMessage(`L'upload a échoué : ${data.error || data.details}`);
      }
    } catch (error) {
      console.error("Une erreur est survenue durant l'upload:", error);
      setMessage('Une erreur réseau est survenue.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div style={{ padding: '40px', maxWidth: '600px', margin: 'auto', fontFamily: 'sans-serif' }}>
      <h1>Test d'Upload vers Azure</h1>
      <p>Cette page permet de tester l'envoi d'un fichier vers la route `/api/dummy-upload`.</p>
      <form onSubmit={handleSubmit} style={{ marginTop: '20px', border: '1px solid #ccc', padding: '20px', borderRadius: '8px' }}>
        <div style={{ marginBottom: '15px' }}>
          <label htmlFor="file-upload" style={{ display: 'block', marginBottom: '5px' }}>Choisir un fichier :</label>
          <input 
            id="file-upload"
            type="file" 
            onChange={handleFileChange} 
          />
        </div>
        <button 
          type="submit" 
          disabled={!file || uploading}
          style={{ padding: '10px 20px', cursor: 'pointer', backgroundColor: '#0070f3', color: 'white', border: 'none', borderRadius: '5px' }}
        >
          {uploading ? 'Envoi en cours...' : 'Envoyer le fichier'}
        </button>
      </form>
      {message && (
        <div style={{ marginTop: '20px', padding: '10px', border: '1px solid #eee', borderRadius: '5px', backgroundColor: '#f9f9f9' }}>
          <strong>Status :</strong> {message}
        </div>
      )}
    </div>
  );
}