import React, { useState, useEffect } from 'react';
import { 
  useAuth 
} from '../context/AuthContext';
import { 
  collection, 
  query, 
  where, 
  onSnapshot, 
  orderBy 
} from 'firebase/firestore';
import { 
  ref, 
  uploadBytes, 
  getDownloadURL, 
  listAll 
} from 'firebase/storage';
import { db, storage } from '../lib/firebase';
import { 
  User, 
  Building, 
  Phone, 
  Mail, 
  Lock, 
  FileText, 
  LogOut, 
  Calendar, 
  Upload, 
  CheckCircle, 
  Loader2, 
  Compass,
  AlertCircle,
  FileDown
} from 'lucide-react';

export default function FirebaseAuthPanel() {
  const { 
    currentUser, 
    userProfile, 
    signUp, 
    signIn, 
    logOut, 
    resetPassword, 
    error, 
    clearError 
  } = useAuth();

  // Navigation / Mode states
  const [isRegister, setIsRegister] = useState<boolean>(false);
  const [showForgot, setShowForgot] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string>('');

  // Input states
  const [email, setEmail] = useState<string>('');
  const [password, setPassword] = useState<string>('');
  const [name, setName] = useState<string>('');
  const [company, setCompany] = useState<string>('');
  const [phone, setPhone] = useState<string>('');

  // Loading states
  const [submitting, setSubmitting] = useState<boolean>(false);

  // Client Portal Data states
  const [userBookings, setUserBookings] = useState<any[]>([]);
  const [userFiles, setUserFiles] = useState<any[]>([]);
  const [uploadingFile, setUploadingFile] = useState<boolean>(false);
  const [fileToUpload, setFileToUpload] = useState<File | null>(null);

  // Fetch client bookings from Firestore dynamically
  useEffect(() => {
    if (!currentUser) return;

    const q = query(
      collection(db, 'consultationRequests'),
      where('userId', '==', currentUser.uid)
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const bookings: any[] = [];
      snapshot.forEach((doc) => {
        bookings.push({ id: doc.id, ...doc.data() });
      });
      // Sort client-side if server-side composite index isn't ready
      bookings.sort((a, b) => {
        const dateA = a.createdAt?.seconds || 0;
        const dateB = b.createdAt?.seconds || 0;
        return dateB - dateA;
      });
      setUserBookings(bookings);
    }, (err) => {
      console.error("Error reading client bookings:", err);
    });

    return unsubscribe;
  }, [currentUser]);

  // Fetch user file uploads from Firebase Storage
  const fetchStorageFiles = async () => {
    if (!currentUser) return;
    try {
      const listRef = ref(storage, `users/${currentUser.uid}/files`);
      const res = await listAll(listRef);
      const filesPromises = res.items.map(async (itemRef) => {
        const url = await getDownloadURL(itemRef);
        return {
          name: itemRef.name,
          url: url,
        };
      });
      const resolvedFiles = await Promise.all(filesPromises);
      setUserFiles(resolvedFiles);
    } catch (err) {
      console.warn("Storage item listing failed (possibly rules or empty directory):", err);
    }
  };

  useEffect(() => {
    if (currentUser) {
      fetchStorageFiles();
    }
  }, [currentUser]);

  // Register or Login form handlers
  const handleAuthSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setStatusMessage('');
    
    if (!email || !password) {
      setStatusMessage('Please fill out email and password parameters.');
      return;
    }

    setSubmitting(true);
    try {
      if (isRegister) {
        if (!name) {
          setStatusMessage('Full Name parameter is required.');
          setSubmitting(false);
          return;
        }
        await signUp(email, password, name, company, phone);
      } else {
        await signIn(email, password);
      }
      // Reset fields on success
      setEmail('');
      setPassword('');
      setName('');
      setCompany('');
      setPhone('');
    } catch (err: any) {
      console.error("Auth action failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Forgot Password handler
  const handleForgotPassword = async (e: React.FormEvent) => {
    e.preventDefault();
    clearError();
    setStatusMessage('');

    if (!email) {
      setStatusMessage('Please specify your registered corporate email.');
      return;
    }

    setSubmitting(true);
    try {
      await resetPassword(email);
      setStatusMessage('Password reset link has been dispatched to your email.');
    } catch (err) {
      console.error("Reset failed:", err);
    } finally {
      setSubmitting(false);
    }
  };

  // Handle document uploading to Firebase Storage
  const handleFileUpload = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !fileToUpload) return;

    setUploadingFile(true);
    setStatusMessage('');

    try {
      const storagePath = `users/${currentUser.uid}/files/${fileToUpload.name}`;
      const fileRef = ref(storage, storagePath);
      
      // Upload raw file bytes
      await uploadBytes(fileRef, fileToUpload);
      
      setStatusMessage('Dossier successfully uploaded to your secure Technical File Vault!');
      setFileToUpload(null);
      // Refresh list
      fetchStorageFiles();
    } catch (err: any) {
      console.error("File upload failed:", err);
      setStatusMessage(`Upload failed: ${err.message || 'Check firestore/storage permissions'}`);
    } finally {
      setUploadingFile(false);
    }
  };

  return (
    <div className="w-full max-w-4xl mx-auto bg-white border border-[#ACBDD3]/30 rounded-xl overflow-hidden shadow-md">
      {!currentUser ? (
        // ==========================================
        // AUTHENTICATION SCREEN (LOGIN / REGISTER / FORGOT)
        // ==========================================
        <div className="grid grid-cols-1 md:grid-cols-2">
          {/* Accent Side Column */}
          <div className="bg-[#2D3A55] text-white p-8 md:p-12 flex flex-col justify-between space-y-8">
            <div className="space-y-4">
              <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-brand-pear bg-brand-pear/10 px-2 py-1 rounded">
                IQzyme Client Portal
              </span>
              <h3 className="font-display font-medium text-2xl leading-snug">
                Access Regulatory Vault & Action Plans
              </h3>
              <p className="text-xs text-brand-cloudy leading-relaxed">
                Log in to coordinate your SUGAM filings, monitor audit progress, download ISO 13485 gap reports, and collaborate securely with senior medical advisers.
              </p>
            </div>
            
            <div className="space-y-3 text-xs text-brand-cloudy pt-6 border-t border-brand-dusk/30">
              <div className="flex items-center gap-2">
                <span className="text-brand-pear font-bold">✓</span> Secure Firebase Environment
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-pear font-bold">✓</span> Real-Time Advisory Scheduling
              </div>
              <div className="flex items-center gap-2">
                <span className="text-brand-pear font-bold">✓</span> Encrypted Technical File Uploads
              </div>
            </div>
          </div>

          {/* Form Side Column */}
          <div className="p-8 md:p-12 space-y-6">
            <div className="text-center md:text-left space-y-1">
              <h4 className="font-display font-bold text-lg text-brand-blue">
                {showForgot ? 'Reset Password' : isRegister ? 'Register Enterprise Account' : 'Partner Sign In'}
              </h4>
              <p className="text-xs text-brand-dusk">
                {showForgot ? 'Provide email to request reset link.' : isRegister ? 'Fill out parameters to register corporate profile.' : 'Sign in using your corporate credentials.'}
              </p>
            </div>

            {/* Error or Success notification boxes */}
            {(error || statusMessage) && (
              <div className={`p-3 rounded text-xs font-medium flex items-start gap-2 ${
                error ? 'bg-brand-coral/10 border border-brand-coral/20 text-brand-coral' : 'bg-brand-pear/10 border border-brand-pear/20 text-brand-blue'
              }`}>
                <AlertCircle size={14} className="shrink-0 mt-0.5" />
                <div>
                  <p>{error || statusMessage}</p>
                  {error && <p className="text-[10px] opacity-80 mt-1">Please verify parameters and attempt again.</p>}
                </div>
              </div>
            )}

            {showForgot ? (
              // FORGOT PASSWORD FORM
              <form onSubmit={handleForgotPassword} className="space-y-4">
                <div className="space-y-1.5">
                  <label htmlFor="forgot-email" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
                    Corporate Email
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-brand-cloudy" size={16} />
                    <input
                      id="forgot-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="s.jenkins@medtech-innovators.com"
                      className="w-full h-10 pl-10 pr-4 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-xs focus:outline-none"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-10 bg-brand-blue hover:bg-brand-blue/90 text-white rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? <Loader2 className="animate-spin" size={14} /> : 'Dispatch Password Reset'}
                </button>

                <div className="text-center">
                  <button
                    type="button"
                    onClick={() => {
                      setShowForgot(false);
                      clearError();
                      setStatusMessage('');
                    }}
                    className="text-xs text-brand-topaz hover:underline"
                  >
                    Return to Login
                  </button>
                </div>
              </form>
            ) : (
              // LOGIN OR REGISTER FORM
              <form onSubmit={handleAuthSubmit} className="space-y-4">
                {isRegister && (
                  <>
                    {/* Name */}
                    <div className="space-y-1">
                      <label htmlFor="auth-name" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
                        Full Name *
                      </label>
                      <div className="relative">
                        <User className="absolute left-3 top-3 text-brand-cloudy" size={16} />
                        <input
                          id="auth-name"
                          type="text"
                          required
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          placeholder="Dr. Sarah Jenkins"
                          className="w-full h-10 pl-10 pr-4 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-xs focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      {/* Company */}
                      <div className="space-y-1">
                        <label htmlFor="auth-company" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
                          Company / Lab
                        </label>
                        <div className="relative">
                          <Building className="absolute left-3 top-3 text-brand-cloudy" size={16} />
                          <input
                            id="auth-company"
                            type="text"
                            value={company}
                            onChange={(e) => setCompany(e.target.value)}
                            placeholder="Medtech Innovators"
                            className="w-full h-10 pl-10 pr-4 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-xs focus:outline-none"
                          />
                        </div>
                      </div>

                      {/* Phone */}
                      <div className="space-y-1">
                        <label htmlFor="auth-phone" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
                          Contact Phone
                        </label>
                        <div className="relative">
                          <Phone className="absolute left-3 top-3 text-brand-cloudy" size={16} />
                          <input
                            id="auth-phone"
                            type="tel"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                            placeholder="+91 98765 43210"
                            className="w-full h-10 pl-10 pr-4 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-xs focus:outline-none"
                          />
                        </div>
                      </div>
                    </div>
                  </>
                )}

                {/* Email */}
                <div className="space-y-1">
                  <label htmlFor="auth-email" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
                    Corporate Email *
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 text-brand-cloudy" size={16} />
                    <input
                      id="auth-email"
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="s.jenkins@medtech-innovators.com"
                      className="w-full h-10 pl-10 pr-4 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Password */}
                <div className="space-y-1">
                  <div className="flex justify-between items-center">
                    <label htmlFor="auth-password" className="block text-xs font-semibold text-brand-blue uppercase tracking-wide">
                      Password *
                    </label>
                    {!isRegister && (
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgot(true);
                          clearError();
                          setStatusMessage('');
                        }}
                        className="text-[11px] text-brand-topaz hover:underline"
                      >
                        Forgot?
                      </button>
                    )}
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 text-brand-cloudy" size={16} />
                    <input
                      id="auth-password"
                      type="password"
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="••••••••"
                      className="w-full h-10 pl-10 pr-4 bg-[#FAF9F5] border border-brand-cloudy/60 focus:ring-2 focus:ring-brand-topaz rounded text-xs focus:outline-none"
                    />
                  </div>
                </div>

                {/* Submit button */}
                <button
                  type="submit"
                  disabled={submitting}
                  className="w-full h-11 bg-brand-pear text-brand-blue hover:bg-[#86b53b] font-bold uppercase tracking-wider rounded shadow-sm transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  {submitting ? (
                    <Loader2 className="animate-spin text-brand-blue" size={16} />
                  ) : (
                    <span>{isRegister ? 'Register Account' : 'Authenticate Credentials'}</span>
                  )}
                </button>

                {/* Switch Modes */}
                <div className="text-center pt-2 border-t border-brand-cloudy/10">
                  <button
                    type="button"
                    onClick={() => {
                      setIsRegister(!isRegister);
                      clearError();
                      setStatusMessage('');
                    }}
                    className="text-xs text-brand-topaz hover:underline font-medium"
                  >
                    {isRegister ? 'Already registered? Sign In' : 'Need an enterprise account? Sign Up'}
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      ) : (
        // ==========================================
        // SECURE ADVISORY CLIENT PORTAL (AUTHENTICATED)
        // ==========================================
        <div className="flex flex-col">
          {/* Top Header Row */}
          <div className="bg-[#2D3A55] text-white p-6 md:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="space-y-1">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-bold font-mono tracking-widest uppercase text-brand-pear bg-brand-pear/10 px-2 py-0.5 rounded">
                  IQzyme Secure Hub
                </span>
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[10px] text-emerald-400 font-mono font-bold uppercase">Online</span>
              </div>
              <h3 className="font-display font-medium text-2xl text-white">
                Welcome, {userProfile?.displayName || currentUser.displayName || 'IQzyme Client'}
              </h3>
              <p className="text-xs text-brand-cloudy">
                Enterprise Dashboard for <strong className="text-white">{userProfile?.companyName || 'Corporate Client'}</strong>
              </p>
            </div>

            <button
              onClick={logOut}
              className="h-10 px-4 bg-brand-dusk hover:bg-brand-coral/20 hover:text-brand-coral rounded text-xs font-semibold uppercase tracking-wider border border-brand-cloudy/20 hover:border-brand-coral/30 flex items-center gap-2 transition-all cursor-pointer"
            >
              <LogOut size={14} />
              <span>Sign Out</span>
            </button>
          </div>

          <div className="p-6 md:p-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Left Column: Personal Profile & Storage Upload Vault */}
            <div className="lg:col-span-1 space-y-6">
              {/* Profile Card */}
              <div className="bg-[#FAF9F5]/40 border border-brand-cloudy/20 rounded-xl p-5 space-y-4">
                <h4 className="font-display font-bold text-sm text-brand-blue border-b border-brand-cloudy/20 pb-2 flex items-center gap-2">
                  <User size={16} className="text-brand-topaz" /> Company Profile Parameters
                </h4>
                
                <div className="space-y-3 text-xs text-brand-dusk">
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-brand-cloudy uppercase">Official Liaison</span>
                    <p className="font-semibold text-brand-blue">{userProfile?.displayName || currentUser.displayName}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-brand-cloudy uppercase">Corporate Registry</span>
                    <p className="font-semibold text-brand-blue">{userProfile?.companyName || 'Not Provided'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-brand-cloudy uppercase">Liaison Phone</span>
                    <p className="font-semibold text-brand-blue">{userProfile?.phone || 'Not Provided'}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-brand-cloudy uppercase">Registered Email</span>
                    <p className="font-semibold text-brand-blue">{userProfile?.email || currentUser.email}</p>
                  </div>
                  <div className="space-y-0.5">
                    <span className="text-[10px] font-semibold text-brand-cloudy uppercase">Account Authority</span>
                    <span className="inline-block text-[9px] font-mono uppercase bg-brand-topaz/10 text-brand-topaz px-2 py-0.5 rounded font-bold mt-1">
                      {userProfile?.role || 'Client'}
                    </span>
                  </div>
                </div>
              </div>

              {/* Secure Document Storage Upload */}
              <div className="bg-white border border-brand-cloudy/20 rounded-xl p-5 space-y-4">
                <h4 className="font-display font-bold text-sm text-brand-blue border-b border-brand-cloudy/20 pb-2 flex items-center gap-2">
                  <Upload size={16} className="text-brand-topaz" /> Technical File Vault (Firebase Storage)
                </h4>
                <p className="text-[11px] text-brand-dusk leading-relaxed">
                  Upload PDF dossiers or audit reports securely under your private user folder. IQzyme analysts can decrypt and audit them within our isolated sandbox environment.
                </p>

                {statusMessage && (
                  <div className="p-2.5 bg-brand-pear/10 border border-brand-pear/20 rounded text-[11px] text-brand-blue font-medium leading-normal">
                    {statusMessage}
                  </div>
                )}

                <form onSubmit={handleFileUpload} className="space-y-3">
                  <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-brand-cloudy/30 border-dashed rounded-lg cursor-pointer bg-[#FAF9F5]/30 hover:bg-[#FAF9F5]/80 hover:border-brand-topaz transition-all">
                      <div className="flex flex-col items-center justify-center pt-4 pb-4 px-2 text-center">
                        <Upload size={20} className="text-brand-topaz mb-1 animate-pulse" />
                        <p className="text-[10px] text-brand-blue font-semibold">
                          {fileToUpload ? fileToUpload.name : 'Select dossier or report file'}
                        </p>
                        <p className="text-[9px] text-brand-cloudy">PDF, DOCX up to 10MB</p>
                      </div>
                      <input 
                        type="file" 
                        className="hidden" 
                        onChange={(e) => {
                          if (e.target.files && e.target.files[0]) {
                            setFileToUpload(e.target.files[0]);
                            setStatusMessage('');
                          }
                        }}
                      />
                    </label>
                  </div>

                  <button
                    type="submit"
                    disabled={!fileToUpload || uploadingFile}
                    className="w-full h-9 bg-brand-blue hover:bg-brand-blue/90 disabled:opacity-40 text-white rounded text-xs font-semibold uppercase tracking-wider transition-all flex items-center justify-center gap-1.5 cursor-pointer"
                  >
                    {uploadingFile ? (
                      <>
                        <Loader2 className="animate-spin" size={12} />
                        <span>Uploading...</span>
                      </>
                    ) : (
                      <>
                        <CheckCircle size={12} />
                        <span>Commit Dossier</span>
                      </>
                    )}
                  </button>
                </form>

                {/* List of uploaded files */}
                {userFiles.length > 0 && (
                  <div className="pt-3 space-y-2 border-t border-brand-cloudy/10">
                    <span className="text-[10px] font-semibold text-brand-cloudy uppercase">Your Secure Uploaded Dossiers:</span>
                    <div className="max-h-36 overflow-y-auto space-y-1.5">
                      {userFiles.map((f, idx) => (
                        <a 
                          key={idx}
                          href={f.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center justify-between p-2 bg-slate-50 border border-slate-100 hover:border-brand-topaz rounded text-[10px] text-brand-blue hover:text-brand-topaz font-medium transition-colors"
                        >
                          <span className="truncate max-w-[150px]">{f.name}</span>
                          <FileDown size={12} className="shrink-0 text-brand-cloudy" />
                        </a>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Right Column: Real-time Consultations & logs */}
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white border border-[#ACBDD3]/30 rounded-xl p-5 md:p-6 space-y-6 shadow-sm">
                <div className="flex items-center justify-between border-b border-brand-cloudy/10 pb-3">
                  <h4 className="font-display font-bold text-sm text-brand-blue flex items-center gap-2">
                    <Calendar size={16} className="text-brand-pear" /> Your Consultation Schedules (Firestore)
                  </h4>
                  <span className="text-[10px] text-brand-cloudy font-mono font-medium">
                    Total: {userBookings.length} Logged
                  </span>
                </div>

                {userBookings.length === 0 ? (
                  <div className="text-center py-12 space-y-4">
                    <Compass size={36} className="text-brand-cloudy mx-auto opacity-40 animate-spin-slow" />
                    <p className="text-xs text-brand-dusk max-w-sm mx-auto leading-relaxed">
                      No advisory consultations registered under this account yet. Fill out the "Confidential Audit Scheduler" in the consultation tab to log your database files!
                    </p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userBookings.map((b) => (
                      <div 
                        key={b.id}
                        className="bg-[#FAF9F5]/40 border border-brand-cloudy/20 p-4 rounded-lg flex flex-col sm:flex-row justify-between gap-4 items-start sm:items-center hover:border-[#00C4B7]/40 hover:shadow-sm transition-all"
                      >
                        <div className="space-y-1 text-left">
                          <span className="inline-block text-[9px] text-[#00C4B7] bg-[#00C4B7]/10 px-2 py-0.5 rounded font-bold uppercase tracking-wider font-mono">
                            {b.serviceStream}
                          </span>
                          <h5 className="font-display font-bold text-sm text-brand-blue">{b.companyName}</h5>
                          <p className="text-xs text-brand-dusk font-medium flex items-center gap-1">
                            📅 {b.consultationDate} @ {b.timeSlot}
                          </p>
                          {b.notes && (
                            <p className="text-[11px] text-brand-cloudy leading-normal max-w-md pt-1">
                              <strong>Scope:</strong> {b.notes}
                            </p>
                          )}
                        </div>

                        <div className="text-right space-y-1 shrink-0">
                          <span className="block text-[10px] text-brand-cloudy font-mono">
                            {b.createdAt ? new Date(b.createdAt.seconds * 1000).toLocaleDateString() : 'Just now'}
                          </span>
                          <span className={`inline-block text-[10px] font-bold px-2.5 py-1 rounded-full uppercase ${
                            b.status === 'pending_confirmation' 
                              ? 'bg-amber-100 text-amber-800' 
                              : b.status === 'confirmed' 
                              ? 'bg-emerald-100 text-emerald-800' 
                              : 'bg-slate-100 text-slate-800'
                          }`}>
                            {b.status === 'pending_confirmation' ? 'Pending Audit' : b.status === 'confirmed' ? 'Scheduled' : b.status}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
