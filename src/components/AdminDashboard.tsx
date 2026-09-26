/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useRef } from 'react';
import { 
  Search, Filter, Download, Trash2, Calendar, Mail, FileText, 
  CheckCircle, Clock, XCircle, AlertCircle, LogOut, Check, ChevronDown, UserCheck,
  Plus, Pencil, Image, Eye, EyeOff, BookOpen, AlertTriangle, CloudUpload,
  ShieldCheck, Activity, BarChart2
} from 'lucide-react';
import { 
  collection, getDocs, doc, updateDoc, deleteDoc, orderBy, query, serverTimestamp, addDoc, where 
} from 'firebase/firestore';
import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage';
import { db, auth, storage } from '../lib/firebase';
import { useAuth } from '../context/AuthContext';
import { BlogPost } from '../types';
import QualityControlReviewQueue from './QualityControlReviewQueue';
import ObservabilityDashboard from './ObservabilityDashboard';

// Define the Firestore error handling types & helper according to the Firebase Integration Skill
enum OperationType {
  CREATE = 'create',
  UPDATE = 'update',
  DELETE = 'delete',
  LIST = 'list',
  GET = 'get',
  WRITE = 'write',
}

interface FirestoreErrorInfo {
  error: string;
  operationType: OperationType;
  path: string | null;
  authInfo: {
    userId?: string | null;
    email?: string | null;
    emailVerified?: boolean | null;
    isAnonymous?: boolean | null;
  }
}

function handleFirestoreError(error: unknown, operationType: OperationType, path: string | null) {
  const errInfo: FirestoreErrorInfo = {
    error: error instanceof Error ? error.message : String(error),
    authInfo: {
      userId: auth.currentUser?.uid,
      email: auth.currentUser?.email,
      emailVerified: auth.currentUser?.emailVerified,
      isAnonymous: auth.currentUser?.isAnonymous,
    },
    operationType,
    path
  };
  console.error('Firestore Error: ', JSON.stringify(errInfo));
  throw new Error(JSON.stringify(errInfo));
}

// Data structures conforming to the firebase-blueprint schema
interface ConsultationRequest {
  id: string;
  userId: string;
  companyName: string;
  consultationDate: string;
  timeSlot: string;
  serviceStream: string;
  notes: string;
  clientEmail: string;
  clientName: string;
  phone: string;
  status: 'pending_confirmation' | 'confirmed' | 'completed' | 'cancelled';
  urgency: string;
  createdAt: any;
}

interface ContactMessage {
  id: string;
  userId: string;
  name: string;
  email: string;
  projectNo: string;
  message: string;
  createdAt: any;
}

interface NewsletterSubscriber {
  id: string;
  email: string;
  createdAt: any;
}

export default function AdminDashboard() {
  const { currentUser, userProfile, signIn, logOut, resetPassword } = useAuth();
  
  // Login Form States
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [isSubmittingLogin, setIsSubmittingLogin] = useState(false);
  const [showReset, setShowReset] = useState(false);
  const [resetSuccess, setResetSuccess] = useState('');
  const [sessionDuration, setSessionDuration] = useState(0);

  // Tabs
  const [activeTab, setActiveTab] = useState<'consultations' | 'enquiries' | 'newsletter' | 'blogs' | 'reviewQueue' | 'observability'>('consultations');

  // Firestore Data State
  const [consultations, setConsultations] = useState<ConsultationRequest[]>([]);
  const [enquiries, setEnquiries] = useState<ContactMessage[]>([]);
  const [subscribers, setSubscribers] = useState<NewsletterSubscriber[]>([]);
  const [blogs, setBlogs] = useState<BlogPost[]>([]);
  
  // Blog CMS Form States
  const [blogFormOpen, setBlogFormOpen] = useState(false);
  const [editingBlog, setEditingBlog] = useState<BlogPost | null>(null);
  const [blogTitle, setBlogTitle] = useState('');
  const [blogCategory, setBlogCategory] = useState('CDSCO Licensing');
  const [blogExcerpt, setBlogExcerpt] = useState('');
  const [blogContent, setBlogContent] = useState('');
  const [blogReadTime, setBlogReadTime] = useState('5 min read');
  const [blogAuthor, setBlogAuthor] = useState('Dr. P. S. Chandranand, Director');
  const [blogImage, setBlogImage] = useState('');
  const [blogPublished, setBlogPublished] = useState(true);
  const [blogDate, setBlogDate] = useState('');

  // Image Upload States
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<number | null>(null);
  const [uploadError, setUploadError] = useState('');

  // Loading & Error states for DB fetching
  const [loadingData, setLoadingData] = useState(false);
  const [dbError, setDbError] = useState('');

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [urgencyFilter, setUrgencyFilter] = useState<string>('all');
  const [blogCategoryFilter, setBlogCategoryFilter] = useState<string>('all');
  const [blogStatusFilter, setBlogStatusFilter] = useState<string>('all');

  // Confirmation Modal or Prompt State
  const [recordToDelete, setRecordToDelete] = useState<{ id: string; collection: string } | null>(null);

  // Check Admin Privilege
  const isAdminUser = userProfile?.role === 'admin' || currentUser?.email === 'yashicajindal1806@gmail.com';

  // Session tracking timer
  useEffect(() => {
    if (!currentUser || !isAdminUser) return;
    
    const interval = setInterval(() => {
      setSessionDuration(prev => prev + 1);
    }, 1000);
    
    return () => clearInterval(interval);
  }, [currentUser, isAdminUser]);

  const formatSessionTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle Admin Password Reset
  const handleAdminPasswordReset = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    setResetSuccess('');
    
    if (!email.trim()) {
      setLoginError('Please specify your administrative email ID.');
      return;
    }
    
    setIsSubmittingLogin(true);
    try {
      await resetPassword(email.trim());
      setResetSuccess('Administrative clearance password reset link dispatched successfully.');
    } catch (err: any) {
      console.error('Password reset failure:', err);
      setLoginError(err.message || 'Failed to trigger password reset process.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Handle Admin Authentication Sign In
  const handleAdminSignIn = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginError('');
    if (!email.trim() || !password) {
      setLoginError('Both email and security clearance passphrase are required.');
      return;
    }
    
    setIsSubmittingLogin(true);
    try {
      await signIn(email.trim(), password);
    } catch (err: any) {
      console.error('Admin authentication failure:', err);
      setLoginError(err.message || 'Incorrect passphrase or security credentials.');
    } finally {
      setIsSubmittingLogin(false);
    }
  };

  // Fetch Data from Firestore
  const fetchAllData = async () => {
    if (!currentUser || !isAdminUser) return;
    
    setLoadingData(true);
    setDbError('');
    try {
      // 1. Fetch consultations
      const consultationsPath = 'consultationRequests';
      try {
        const qConsultations = query(collection(db, consultationsPath), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(qConsultations);
        const fetchedConsultations: ConsultationRequest[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedConsultations.push({
            id: docSnap.id,
            ...docSnap.data()
          } as ConsultationRequest);
        });
        setConsultations(fetchedConsultations);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, consultationsPath);
      }

      // 2. Fetch contact messages
      const contactPath = 'contactMessages';
      try {
        const qEnquiries = query(collection(db, contactPath), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(qEnquiries);
        const fetchedEnquiries: ContactMessage[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedEnquiries.push({
            id: docSnap.id,
            ...docSnap.data()
          } as ContactMessage);
        });
        setEnquiries(fetchedEnquiries);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, contactPath);
      }

      // 3. Fetch newsletter subscribers
      const newsletterPath = 'newsletterSubscribers';
      try {
        const qSubscribers = query(collection(db, newsletterPath), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(qSubscribers);
        const fetchedSubscribers: NewsletterSubscriber[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedSubscribers.push({
            id: docSnap.id,
            ...docSnap.data()
          } as NewsletterSubscriber);
        });
        setSubscribers(fetchedSubscribers);
      } catch (err) {
        handleFirestoreError(err, OperationType.LIST, newsletterPath);
      }

      // 4. Fetch blogs
      const blogsPath = 'blogs';
      try {
        const qBlogs = query(collection(db, blogsPath), orderBy('createdAt', 'desc'));
        const querySnapshot = await getDocs(qBlogs);
        const fetchedBlogs: BlogPost[] = [];
        querySnapshot.forEach((docSnap) => {
          fetchedBlogs.push({
            id: docSnap.id,
            ...docSnap.data()
          } as BlogPost);
        });
        setBlogs(fetchedBlogs);
      } catch (err) {
        console.warn("Retrying blogs fetch without orderBy (index might be provisioning)...");
        try {
          const qBlogsNoOrder = query(collection(db, blogsPath));
          const querySnapshot = await getDocs(qBlogsNoOrder);
          const fetchedBlogs: BlogPost[] = [];
          querySnapshot.forEach((docSnap) => {
            fetchedBlogs.push({
              id: docSnap.id,
              ...docSnap.data()
            } as BlogPost);
          });
          // Sort client side
          fetchedBlogs.sort((a: any, b: any) => {
            const timeA = a.createdAt?.seconds || 0;
            const timeB = b.createdAt?.seconds || 0;
            return timeB - timeA;
          });
          setBlogs(fetchedBlogs);
        } catch (innerErr) {
          handleFirestoreError(innerErr, OperationType.LIST, blogsPath);
        }
      }

    } catch (err: any) {
      console.error('Failed to reload database logs:', err);
      setDbError('Access Denied or Database Connection Error. Ensure your account is authorized.');
    } finally {
      setLoadingData(false);
    }
  };

  useEffect(() => {
    if (currentUser && isAdminUser) {
      fetchAllData();
    }
  }, [currentUser, isAdminUser]);

  // Update Consultation Request Status
  const handleUpdateStatus = async (id: string, newStatus: 'pending_confirmation' | 'confirmed' | 'completed' | 'cancelled') => {
    const consultationsPath = `consultationRequests/${id}`;
    try {
      const docRef = doc(db, 'consultationRequests', id);
      await updateDoc(docRef, { status: newStatus });
      
      // Update local state smoothly
      setConsultations(prev => 
        prev.map(c => c.id === id ? { ...c, status: newStatus } : c)
      );
    } catch (err) {
      handleFirestoreError(err, OperationType.UPDATE, consultationsPath);
    }
  };

  // Delete Record Handlers
  const triggerDelete = (id: string, collectionName: string) => {
    setRecordToDelete({ id, collection: collectionName });
  };

  const confirmDeleteRecord = async () => {
    if (!recordToDelete) return;
    const { id, collection: colName } = recordToDelete;
    const documentPath = `${colName}/${id}`;
    
    try {
      await deleteDoc(doc(db, colName, id));
      
      // Update local UI states
      if (colName === 'consultationRequests') {
        setConsultations(prev => prev.filter(c => c.id !== id));
      } else if (colName === 'contactMessages') {
        setEnquiries(prev => prev.filter(e => e.id !== id));
      } else if (colName === 'newsletterSubscribers') {
        setSubscribers(prev => prev.filter(s => s.id !== id));
      } else if (colName === 'blogs') {
        setBlogs(prev => prev.filter(b => b.id !== id));
      }
      
      setRecordToDelete(null);
    } catch (err) {
      handleFirestoreError(err, OperationType.DELETE, documentPath);
    }
  };

  // =========================================================================
  // BLOG CMS OPERATIONAL HANDLERS
  // =========================================================================

  const handleOpenCreateBlog = () => {
    setEditingBlog(null);
    setBlogTitle('');
    setBlogCategory('CDSCO Licensing');
    setBlogExcerpt('');
    setBlogContent('');
    setBlogReadTime('5 min read');
    setBlogAuthor('Dr. P. S. Chandranand, Director');
    setBlogImage('');
    setBlogPublished(true);
    setBlogDate(new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }));
    setUploadError('');
    setUploadProgress(null);
    setBlogFormOpen(true);
  };

  const handleOpenEditBlog = (blog: BlogPost) => {
    setEditingBlog(blog);
    setBlogTitle(blog.title || '');
    setBlogCategory(blog.category || 'General');
    setBlogExcerpt(blog.excerpt || '');
    setBlogContent(blog.content || '');
    setBlogReadTime(blog.readTime || '5 min read');
    setBlogAuthor(blog.author || 'Dr. P. S. Chandranand, Director');
    setBlogImage(blog.image || '');
    setBlogPublished(blog.published !== false); // Default to true if not specified
    setBlogDate(blog.date || '');
    setUploadError('');
    setUploadProgress(null);
    setBlogFormOpen(true);
  };

  // Safe image uploader to Firebase Storage
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate is image
    if (!file.type.startsWith('image/')) {
      setUploadError('Invalid file format. Please upload an image (PNG, JPG, JPEG, WEBP).');
      return;
    }

    // Limit size to 5MB
    if (file.size > 5 * 1024 * 1024) {
      setUploadError('File is too large. Image size should be less than 5MB.');
      return;
    }

    setUploadError('');
    setIsUploading(true);
    setUploadProgress(0);

    // Read file locally as persistent data URL as backup/immediate preview
    const reader = new FileReader();
    reader.onload = (uploadEvt) => {
      const resultDataUrl = uploadEvt.target?.result as string;
      if (resultDataUrl) {
        setBlogImage(resultDataUrl);
      }
    };
    reader.readAsDataURL(file);

    const storagePath = `blog_images/${Date.now()}_${file.name}`;
    const storageRef = ref(storage, storagePath);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      'state_changed',
      (snapshot) => {
        const progress = Math.round((snapshot.bytesTransferred / snapshot.totalBytes) * 100);
        setUploadProgress(progress);
      },
      (error) => {
        console.warn('Firebase Storage offline or unconfigured, using persistent local image data:', error);
        // Do not throw fatal error, local data URL is already set!
        setIsUploading(false);
        setUploadProgress(null);
      },
      async () => {
        try {
          const downloadUrl = await getDownloadURL(uploadTask.snapshot.ref);
          setBlogImage(downloadUrl);
        } catch (urlErr: any) {
          console.warn('Using persistent local image data URL instead:', urlErr);
        } finally {
          setIsUploading(false);
          setUploadProgress(null);
        }
      }
    );
  };

  const handleSaveBlog = async (e: React.FormEvent) => {
    e.preventDefault();
    setDbError('');

    if (!blogTitle.trim()) {
      setDbError('Article title is required.');
      return;
    }
    if (!blogCategory.trim()) {
      setDbError('Category classification is required.');
      return;
    }
    if (!blogExcerpt.trim()) {
      setDbError('A short excerpt or summary is required.');
      return;
    }
    if (!blogContent.trim()) {
      setDbError('Article body content is required.');
      return;
    }

    setLoadingData(true);
    const payload = {
      title: blogTitle.trim(),
      category: blogCategory.trim(),
      excerpt: blogExcerpt.trim(),
      content: blogContent.trim(),
      readTime: blogReadTime.trim(),
      author: blogAuthor.trim(),
      image: blogImage.trim() || '/images/molecular_diagnostics_lab.jpg',
      published: blogPublished,
      date: blogDate.trim() || new Date().toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }),
      updatedAt: serverTimestamp()
    };

    try {
      if (editingBlog) {
        // Edit Mode
        const documentPath = `blogs/${editingBlog.id}`;
        try {
          const docRef = doc(db, 'blogs', editingBlog.id);
          await updateDoc(docRef, payload);
          
          // Update local state smoothly
          setBlogs(prev => 
            prev.map(b => b.id === editingBlog.id ? { ...b, ...payload } as any : b)
          );
        } catch (err) {
          handleFirestoreError(err, OperationType.UPDATE, documentPath);
        }
      } else {
        // Create Mode
        const documentPath = 'blogs';
        try {
          const blogRef = await addDoc(collection(db, 'blogs'), {
            ...payload,
            createdAt: serverTimestamp()
          });
          
          const newBlog: BlogPost = {
            id: blogRef.id,
            ...payload,
            createdAt: { seconds: Date.now() / 1000 }
          } as any;

          // Add to local state smoothly
          setBlogs(prev => [newBlog, ...prev]);
        } catch (err) {
          handleFirestoreError(err, OperationType.CREATE, documentPath);
        }
      }

      setBlogFormOpen(false);
      setEditingBlog(null);
    } catch (err: any) {
      console.error('Failed to preserve blog article:', err);
      setDbError('Database rejection. Ensure your admin security clearance is active.');
    } finally {
      setLoadingData(false);
    }
  };

  // Helper to format Firestore dates safely
  const formatTimestamp = (timestamp: any) => {
    if (!timestamp) return 'N/A';
    // If it is a Firestore Timestamp object
    if (timestamp.seconds) {
      return new Date(timestamp.seconds * 1000).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
      });
    }
    // If it is a string representation
    return new Date(timestamp).toLocaleDateString('en-US', {
      year: 'numeric', month: 'short', day: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  // Filtering Logic
  const filteredConsultations = consultations.filter(c => {
    const matchesSearch = 
      (c.companyName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (c.clientName?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (c.clientEmail?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (c.serviceStream?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (c.phone?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
    const matchesUrgency = urgencyFilter === 'all' || c.urgency === urgencyFilter;
    
    return matchesSearch && matchesStatus && matchesUrgency;
  });

  const filteredEnquiries = enquiries.filter(e => {
    return (
      (e.name?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (e.email?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (e.projectNo?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (e.message?.toLowerCase() || '').includes(searchQuery.toLowerCase())
    );
  });

  const filteredSubscribers = subscribers.filter(s => {
    return (s.email?.toLowerCase() || '').includes(searchQuery.toLowerCase());
  });

  const filteredBlogs = blogs.filter(b => {
    const matchesSearch = 
      (b.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (b.author?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (b.category?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (b.excerpt?.toLowerCase() || '').includes(searchQuery.toLowerCase()) ||
      (b.content?.toLowerCase() || '').includes(searchQuery.toLowerCase());
    
    const matchesCategory = blogCategoryFilter === 'all' || b.category === blogCategoryFilter;
    
    const matchesStatus = blogStatusFilter === 'all' || 
      (blogStatusFilter === 'published' && b.published !== false) ||
      (blogStatusFilter === 'draft' && b.published === false);
    
    return matchesSearch && matchesCategory && matchesStatus;
  });

  // Export currently filtered list to CSV file
  const handleExportCSV = () => {
    let csvContent = '';
    let fileName = '';

    if (activeTab === 'consultations') {
      fileName = `IQzyme_Consultation_Requests_${new Date().toISOString().slice(0, 10)}.csv`;
      // Header row
      csvContent += 'Client Name,Email,Phone,Company,Consultation Date,Time Slot,Service Stream,Urgency,Status,Notes,Created At\n';
      filteredConsultations.forEach(c => {
        const row = [
          `"${(c.clientName || '').replace(/"/g, '""')}"`,
          `"${(c.clientEmail || '').replace(/"/g, '""')}"`,
          `"${(c.phone || '').replace(/"/g, '""')}"`,
          `"${(c.companyName || '').replace(/"/g, '""')}"`,
          `"${(c.consultationDate || '').replace(/"/g, '""')}"`,
          `"${(c.timeSlot || '').replace(/"/g, '""')}"`,
          `"${(c.serviceStream || '').replace(/"/g, '""')}"`,
          `"${(c.urgency || '').replace(/"/g, '""')}"`,
          `"${(c.status || '').replace(/"/g, '""')}"`,
          `"${(c.notes || '').replace(/\n/g, ' ').replace(/"/g, '""')}"`,
          `"${formatTimestamp(c.createdAt)}"`
        ].join(',');
        csvContent += row + '\n';
      });
    } else if (activeTab === 'enquiries') {
      fileName = `IQzyme_Contact_Enquiries_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent += 'Name,Email,Project Number,Message,Received At\n';
      filteredEnquiries.forEach(e => {
        const row = [
          `"${(e.name || '').replace(/"/g, '""')}"`,
          `"${(e.email || '').replace(/"/g, '""')}"`,
          `"${(e.projectNo || '').replace(/"/g, '""')}"`,
          `"${(e.message || '').replace(/\n/g, ' ').replace(/"/g, '""')}"`,
          `"${formatTimestamp(e.createdAt)}"`
        ].join(',');
        csvContent += row + '\n';
      });
    } else if (activeTab === 'newsletter') {
      fileName = `IQzyme_Newsletter_Subscribers_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent += 'Email,Subscribed At\n';
      filteredSubscribers.forEach(s => {
        const row = [
          `"${(s.email || '').replace(/"/g, '""')}"`,
          `"${formatTimestamp(s.createdAt)}"`
        ].join(',');
        csvContent += row + '\n';
      });
    } else if (activeTab === 'blogs') {
      fileName = `IQzyme_Blog_Articles_${new Date().toISOString().slice(0, 10)}.csv`;
      csvContent += 'Title,Category,Author,Read Time,Status,Date,Excerpt,Created At\n';
      filteredBlogs.forEach(b => {
        const row = [
          `"${(b.title || '').replace(/"/g, '""')}"`,
          `"${(b.category || '').replace(/"/g, '""')}"`,
          `"${(b.author || '').replace(/"/g, '""')}"`,
          `"${(b.readTime || '').replace(/"/g, '""')}"`,
          `"${b.published !== false ? 'Published' : 'Draft'}"`,
          `"${(b.date || '').replace(/"/g, '""')}"`,
          `"${(b.excerpt || '').replace(/\n/g, ' ').replace(/"/g, '""')}"`,
          `"${formatTimestamp(b.createdAt)}"`
        ].join(',');
        csvContent += row + '\n';
      });
    }

    // Trigger browser download
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', fileName);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Rendering non-admin view (Login panel or Access Denied warning)
  if (!currentUser) {
    return (
      <div id="admin-auth-panel" className="max-w-md mx-auto my-12 bg-white rounded-lg border border-brand-cloudy/30 shadow-sm overflow-hidden">
        <div className="bg-[#2D3A55] p-6 text-white text-center">
          <h2 className="font-display font-medium text-xl uppercase tracking-wider">Administrative Clearance</h2>
          <p className="text-xs text-brand-cloudy mt-1">IQzyme Compliance Portal Control Panel</p>
        </div>
        {showReset ? (
          <form onSubmit={handleAdminPasswordReset} className="p-6 md:p-8 space-y-5">
            {loginError && (
              <div className="p-3 bg-brand-coral/10 border border-brand-coral/20 rounded text-xs text-brand-coral font-medium flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            {resetSuccess && (
              <div className="p-3 bg-emerald-50 border border-emerald-200 rounded text-xs text-emerald-700 font-medium flex items-center gap-2">
                <Check size={14} className="shrink-0" />
                <span>{resetSuccess}</span>
              </div>
            )}
            <p className="text-xs text-brand-dusk">
              Provide your administrative email ID below to trigger a secure passphrase reset dispatch.
            </p>
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Admin Email ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yashicajindal1806@gmail.com"
                className="w-full h-10 px-3 bg-white border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-sm transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmittingLogin}
              className="w-full h-10 bg-[#2D3A55] hover:bg-[#1a2333] text-white font-semibold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmittingLogin ? 'Dispatching Reset...' : 'Request Passphrase Reset'}
            </button>
            <div className="text-center">
              <button
                type="button"
                onClick={() => {
                  setShowReset(false);
                  setLoginError('');
                  setResetSuccess('');
                }}
                className="text-xs text-brand-topaz hover:underline cursor-pointer"
              >
                Return to Admin Login
              </button>
            </div>
          </form>
        ) : (
          <form onSubmit={handleAdminSignIn} className="p-6 md:p-8 space-y-5">
            {loginError && (
              <div className="p-3 bg-brand-coral/10 border border-brand-coral/20 rounded text-xs text-brand-coral font-medium flex items-center gap-2">
                <AlertCircle size={14} className="shrink-0" />
                <span>{loginError}</span>
              </div>
            )}
            <div className="space-y-1.5">
              <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Admin Email ID</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="yashicajindal1806@gmail.com"
                className="w-full h-10 px-3 bg-white border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-sm transition-all"
              />
            </div>
            <div className="space-y-1.5">
              <div className="flex justify-between items-center">
                <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Passphrase</label>
                <button
                  type="button"
                  onClick={() => {
                    setShowReset(true);
                    setLoginError('');
                    setResetSuccess('');
                  }}
                  className="text-[10px] text-brand-topaz hover:underline cursor-pointer"
                >
                  Forgot Passphrase?
                </button>
              </div>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                className="w-full h-10 px-3 bg-white border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-sm transition-all"
              />
            </div>
            <button 
              type="submit" 
              disabled={isSubmittingLogin}
              className="w-full h-10 bg-[#2D3A55] hover:bg-[#1a2333] text-white font-semibold text-xs uppercase tracking-wider rounded transition-colors cursor-pointer flex items-center justify-center gap-2"
            >
              {isSubmittingLogin ? 'Validating Clearance...' : 'Authenticate Clearance'}
            </button>
          </form>
        )}
      </div>
    );
  }

  // Logged in but not Admin User
  if (!isAdminUser) {
    return (
      <div id="admin-access-denied" className="max-w-md mx-auto my-12 bg-white rounded-lg border border-brand-coral/20 p-8 text-center space-y-4 shadow-sm">
        <div className="mx-auto w-12 h-12 bg-brand-coral/10 text-brand-coral rounded-full flex items-center justify-center">
          <AlertCircle size={28} />
        </div>
        <h3 className="font-display font-medium text-xl text-brand-blue">Security Clearance Required</h3>
        <p className="text-xs text-brand-dusk leading-relaxed">
          The authenticated identity <strong className="text-brand-blue">{currentUser.email}</strong> does not possess the credentials to enter the IQzyme administrative records.
        </p>
        <div className="pt-4 flex flex-col gap-2">
          <button 
            onClick={() => logOut()}
            className="w-full h-10 bg-[#2D3A55] text-white font-semibold text-xs uppercase tracking-wider rounded hover:bg-[#1e273a] cursor-pointer"
          >
            Sign Out of Portal
          </button>
        </div>
      </div>
    );
  }

  return (
    <div id="admin-dashboard-root" className="space-y-6">
      
      {/* Dashboard Top Navigation & User Welcome Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white border border-brand-cloudy/30 p-4 rounded-xl shadow-sm">
        <div className="flex items-center gap-3">
          <div className="p-2.5 bg-brand-topaz/10 rounded-lg text-brand-blue">
            <UserCheck size={24} />
          </div>
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#00C4B7]">Compliance Operations</span>
            <h1 className="font-display font-medium text-lg text-brand-blue">IQzyme Admin Dashboard</h1>
          </div>
        </div>
        
        <div className="flex items-center justify-between md:justify-end gap-3 border-t md:border-t-0 pt-3 md:pt-0 border-brand-cloudy/20">
          <div className="text-left md:text-right hidden sm:block">
            <p className="text-xs font-semibold text-brand-blue">{userProfile?.displayName || 'Senior Admin'}</p>
            <p className="text-[10px] text-brand-dusk">{currentUser.email}</p>
          </div>
          {/* Active Session Indicator */}
          <div className="px-3 py-1 bg-emerald-50 border border-emerald-200 rounded-md text-center hidden md:block">
            <div className="flex items-center gap-1.5 justify-center">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
              <span className="text-[9px] font-mono font-bold text-emerald-700 uppercase">Live Session</span>
            </div>
            <p className="text-[10px] font-mono font-bold text-[#2D3A55]">{formatSessionTime(sessionDuration)}</p>
          </div>
          <button 
            onClick={() => logOut()}
            className="h-9 px-4 text-xs font-semibold uppercase tracking-wider border border-brand-coral/30 text-brand-coral rounded hover:bg-brand-coral/5 transition-all flex items-center gap-1.5 cursor-pointer"
            title="Terminate Clearance Session"
          >
            <LogOut size={13} />
            <span>Sign Out</span>
          </button>
        </div>
      </div>

      {/* Main Database Tab Controls & Action Bar */}
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        {/* Horizontal Navigation Tabs */}
        <div className="flex flex-wrap bg-white p-1 rounded-lg border border-brand-cloudy/30 gap-1 w-full lg:w-auto">
          <button 
            onClick={() => { setActiveTab('consultations'); setSearchQuery(''); }}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'consultations' 
                ? 'bg-[#2D3A55] text-white shadow-sm' 
                : 'text-brand-dusk hover:text-[#2D3A55]'
            }`}
          >
            Consultation Requests ({consultations.length})
          </button>
          <button 
            onClick={() => { setActiveTab('enquiries'); setSearchQuery(''); }}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'enquiries' 
                ? 'bg-[#2D3A55] text-white shadow-sm' 
                : 'text-brand-dusk hover:text-[#2D3A55]'
            }`}
          >
            Contact Enquiries ({enquiries.length})
          </button>
          <button 
            onClick={() => { setActiveTab('newsletter'); setSearchQuery(''); }}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'newsletter' 
                ? 'bg-[#2D3A55] text-white shadow-sm' 
                : 'text-brand-dusk hover:text-[#2D3A55]'
            }`}
          >
            Newsletter Brief ({subscribers.length})
          </button>
          <button 
            onClick={() => { setActiveTab('blogs'); setSearchQuery(''); }}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer ${
              activeTab === 'blogs' 
                ? 'bg-[#2D3A55] text-white shadow-sm' 
                : 'text-brand-dusk hover:text-[#2D3A55]'
            }`}
          >
            Blog CMS ({blogs.length})
          </button>
          <button 
            onClick={() => { setActiveTab('reviewQueue'); setSearchQuery(''); }}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'reviewQueue' 
                ? 'bg-[#00C4B7] text-white shadow-sm' 
                : 'text-brand-blue hover:text-[#00C4B7] hover:bg-[#00C4B7]/10'
            }`}
          >
            <ShieldCheck size={14} />
            <span>QC Review Queue</span>
            <span className={`px-1.5 py-0.5 text-[9px] font-mono rounded font-bold ${
              activeTab === 'reviewQueue' ? 'bg-white/20 text-white' : 'bg-brand-blue/10 text-brand-blue'
            }`}>
              Claude
            </span>
          </button>
          <button 
            onClick={() => { setActiveTab('observability'); setSearchQuery(''); }}
            className={`px-3.5 py-2 text-xs font-bold uppercase tracking-wider rounded transition-all cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'observability' 
                ? 'bg-[#99CE43] text-brand-blue shadow-sm font-extrabold' 
                : 'text-brand-blue hover:text-[#86b53b] hover:bg-[#99CE43]/15'
            }`}
          >
            <Activity size={14} />
            <span>Observability &amp; Costs</span>
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#00C4B7] opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-[#00C4B7]"></span>
            </span>
          </button>
        </div>

        {/* Action Button: Export to CSV (for CRM tabs) */}
        {activeTab !== 'reviewQueue' && activeTab !== 'observability' && (
          <div className="flex items-center gap-2">
            <button 
              onClick={fetchAllData}
              className="px-4 h-9 bg-brand-blue/5 border border-brand-blue/15 text-brand-blue text-xs font-semibold uppercase tracking-wider rounded hover:bg-brand-blue/10 transition-all flex items-center gap-1.5 cursor-pointer"
              disabled={loadingData}
            >
              {loadingData ? 'Syncing...' : 'Reload Logs'}
            </button>
            <button 
              onClick={handleExportCSV}
              className="px-4 h-9 bg-[#00C4B7] text-white text-xs font-semibold uppercase tracking-wider rounded shadow-sm hover:bg-[#00b0a4] transition-all flex items-center gap-1.5 cursor-pointer"
            >
              <Download size={13} />
              <span>Export to CSV</span>
            </button>
          </div>
        )}
      </div>

      {/* Render QC Review Queue Tab */}
      {activeTab === 'reviewQueue' && (
        <QualityControlReviewQueue />
      )}

      {/* Render Observability Tab */}
      {activeTab === 'observability' && (
        <ObservabilityDashboard />
      )}

      {/* CRM Tabs Content (Consultations, Enquiries, Newsletter, Blogs) */}
      {activeTab !== 'reviewQueue' && activeTab !== 'observability' && (
        <>
          {/* Real-time search and secondary filters bar */}
          <div className="bg-white border border-brand-cloudy/30 p-4 rounded-xl shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="relative w-full md:max-w-md">
          <Search size={14} className="absolute left-3.5 top-3.5 text-brand-cloudy" />
          <input 
            type="text" 
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={
              activeTab === 'consultations' 
                ? 'Search company name, contact liaisons, service stream, emails...' 
                : activeTab === 'enquiries' 
                  ? 'Search sender name, email ID, project number, keywords...'
                  : activeTab === 'blogs'
                    ? 'Search blog title, author, category, keywords, content...'
                    : 'Search subscribed newsletter emails...'
            }
            className="w-full h-10 pl-10 pr-4 bg-[#FAF9F5]/40 border border-brand-cloudy/50 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-xs transition-all"
          />
        </div>

        {/* Filter dropdowns specific to Consultations tab */}
        {activeTab === 'consultations' && (
          <div className="flex flex-wrap gap-3 w-full md:w-auto">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Status:</span>
              <select 
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="h-8 text-xs bg-white border border-brand-cloudy/50 rounded px-2.5 focus:outline-none focus:ring-1 focus:ring-[#00C4B7]"
              >
                <option value="all">All States</option>
                <option value="pending_confirmation">Pending Confirmation</option>
                <option value="confirmed">Confirmed</option>
                <option value="completed">Completed</option>
                <option value="cancelled">Cancelled</option>
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Urgency:</span>
              <select 
                value={urgencyFilter}
                onChange={(e) => setUrgencyFilter(e.target.value)}
                className="h-8 text-xs bg-white border border-brand-cloudy/50 rounded px-2.5 focus:outline-none focus:ring-1 focus:ring-[#00C4B7]"
              >
                <option value="all">All Priority Levels</option>
                <option value="high">High priority</option>
                <option value="medium">Medium priority</option>
                <option value="standard">Standard priority</option>
                <option value="low">Low priority</option>
              </select>
            </div>
          </div>
        )}

        {/* Filter dropdowns specific to Blogs tab */}
        {activeTab === 'blogs' && (
          <div className="flex flex-wrap gap-3 w-full md:w-auto items-center">
            {/* Create New Blog Trigger */}
            <button
              onClick={handleOpenCreateBlog}
              className="h-8 px-3 bg-[#2D3A55] text-white text-[10px] font-bold uppercase tracking-wider rounded shadow-sm hover:bg-[#1e273a] transition-all flex items-center gap-1 cursor-pointer"
            >
              <Plus size={11} />
              <span>New Article</span>
            </button>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Category:</span>
              <select 
                value={blogCategoryFilter}
                onChange={(e) => setBlogCategoryFilter(e.target.value)}
                className="h-8 text-xs bg-white border border-brand-cloudy/50 rounded px-2.5 focus:outline-none focus:ring-1 focus:ring-[#00C4B7]"
              >
                <option value="all">All Categories</option>
                {Array.from(new Set(blogs.map(b => b.category).filter(Boolean))).map(cat => (
                  <option key={cat} value={cat}>{cat}</option>
                ))}
                {/* Seed options just in case list is empty */}
                {Array.from(new Set(blogs.map(b => b.category).filter(Boolean))).length === 0 && (
                  <>
                    <option value="CDSCO Licensing">CDSCO Licensing</option>
                    <option value="WHO-PQ Advisory">WHO-PQ Advisory</option>
                    <option value="MD-14 Turnkey Projects">MD-14 Turnkey Projects</option>
                  </>
                )}
              </select>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold text-brand-blue uppercase tracking-wider">Status:</span>
              <select 
                value={blogStatusFilter}
                onChange={(e) => setBlogStatusFilter(e.target.value)}
                className="h-8 text-xs bg-white border border-brand-cloudy/50 rounded px-2.5 focus:outline-none focus:ring-1 focus:ring-[#00C4B7]"
              >
                <option value="all">All Statuses</option>
                <option value="published">Published Only</option>
                <option value="draft">Drafts Only</option>
              </select>
            </div>
          </div>
        )}
      </div>

      {/* Main Records Presentation Board */}
      <div className="bg-white border border-brand-cloudy/30 rounded-xl shadow-sm overflow-hidden min-h-[300px]">
        {loadingData ? (
          <div className="flex flex-col items-center justify-center py-20 space-y-3">
            <div className="w-8 h-8 border-2 border-brand-topaz border-t-transparent rounded-full animate-spin"></div>
            <p className="text-xs text-brand-dusk font-medium">Decrypting database logs securely...</p>
          </div>
        ) : dbError ? (
          <div className="text-center py-20 space-y-3">
            <AlertCircle className="mx-auto text-brand-coral" size={32} />
            <p className="text-xs text-brand-coral font-medium">{dbError}</p>
            <button 
              onClick={fetchAllData}
              className="px-4 py-2 bg-brand-blue/10 text-brand-blue rounded text-xs font-semibold hover:bg-brand-blue/15 cursor-pointer"
            >
              Retry Connection
            </button>
          </div>
        ) : (
          <>
            {/* TAB: CONSULTATION REQUESTS */}
            {activeTab === 'consultations' && (
              <div className="overflow-x-auto">
                {filteredConsultations.length === 0 ? (
                  <div className="text-center py-16 text-brand-cloudy text-xs">
                    No consultation dossiers found matching the query.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-brand-cloudy/30 text-brand-blue font-bold uppercase tracking-wide text-[10px]">
                        <th className="p-4">Enterprise / Client</th>
                        <th className="p-4">Advisory Stream</th>
                        <th className="p-4">Schedule Date & Slot</th>
                        <th className="p-4">Urgency</th>
                        <th className="p-4">Status & Action</th>
                        <th className="p-4 text-right">Operational Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-cloudy/15 text-brand-dusk">
                      {filteredConsultations.map((c) => (
                        <tr key={c.id} className="hover:bg-brand-blue/[0.01] transition-colors">
                          <td className="p-4 space-y-1">
                            <p className="font-semibold text-brand-blue text-sm">{c.companyName}</p>
                            <p className="font-medium text-brand-blue">{c.clientName}</p>
                            <div className="text-[10px] text-brand-cloudy space-y-0.5">
                              <p className="flex items-center gap-1"><Mail size={10} /> {c.clientEmail}</p>
                              <p className="flex items-center gap-1">📞 {c.phone}</p>
                            </div>
                          </td>
                          <td className="p-4 space-y-1 max-w-[200px]">
                            <span className="text-[10px] font-bold uppercase bg-brand-blue/5 text-brand-blue px-2 py-0.5 rounded">
                              {c.serviceStream}
                            </span>
                            {c.notes && (
                              <p className="text-[10px] text-brand-dusk line-clamp-2 mt-1 leading-relaxed" title={c.notes}>
                                "{c.notes}"
                              </p>
                            )}
                          </td>
                          <td className="p-4 space-y-1">
                            <p className="font-semibold text-brand-blue flex items-center gap-1">
                              <Calendar size={12} className="text-[#00C4B7]" /> {c.consultationDate}
                            </p>
                            <p className="text-[10px] text-brand-cloudy font-mono flex items-center gap-1">
                              <Clock size={11} /> {c.timeSlot}
                            </p>
                            <p className="text-[9px] text-brand-cloudy pt-1">Logged: {formatTimestamp(c.createdAt)}</p>
                          </td>
                          <td className="p-4">
                            <span className={`text-[9px] font-bold uppercase tracking-wider px-2 py-0.5 rounded ${
                              c.urgency === 'high' 
                                ? 'bg-brand-coral/10 text-brand-coral' 
                                : c.urgency === 'medium' 
                                  ? 'bg-brand-orange/10 text-brand-orange' 
                                  : 'bg-brand-topaz/15 text-brand-blue'
                            }`}>
                              {c.urgency}
                            </span>
                          </td>
                          <td className="p-4 space-y-2">
                            <span className={`text-[10px] font-semibold uppercase tracking-wider px-2.5 py-1 rounded-full inline-flex items-center gap-1.5 ${
                              c.status === 'confirmed' 
                                ? 'bg-brand-pear/20 text-brand-blue' 
                                : c.status === 'completed'
                                  ? 'bg-brand-topaz/10 text-[#00C4B7]'
                                  : c.status === 'cancelled'
                                    ? 'bg-brand-coral/10 text-brand-coral'
                                    : 'bg-brand-orange/10 text-brand-orange'
                            }`}>
                              {c.status === 'confirmed' && <CheckCircle size={10} />}
                              {c.status === 'completed' && <CheckCircle size={10} />}
                              {c.status === 'cancelled' && <XCircle size={10} />}
                              {c.status === 'pending_confirmation' && <Clock size={10} />}
                              {c.status.replace('_', ' ')}
                            </span>

                            {/* Dropdown status update for Admin */}
                            <div className="pt-1.5 flex items-center gap-1">
                              <span className="text-[9px] text-brand-cloudy font-semibold uppercase">Update state:</span>
                              <select 
                                value={c.status}
                                onChange={(e) => handleUpdateStatus(c.id, e.target.value as any)}
                                className="h-6 text-[10px] bg-white border border-brand-cloudy/30 rounded focus:outline-none cursor-pointer"
                              >
                                <option value="pending_confirmation">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                              </select>
                            </div>
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => triggerDelete(c.id, 'consultationRequests')}
                              className="p-1.5 text-brand-coral hover:bg-brand-coral/5 rounded transition-all cursor-pointer inline-flex items-center"
                              title="Delete Record"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB: CONTACT ENQUIRIES */}
            {activeTab === 'enquiries' && (
              <div className="overflow-x-auto">
                {filteredEnquiries.length === 0 ? (
                  <div className="text-center py-16 text-brand-cloudy text-xs">
                    No contact messages found matching the query.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-brand-cloudy/30 text-brand-blue font-bold uppercase tracking-wide text-[10px]">
                        <th className="p-4">Sender Details</th>
                        <th className="p-4">Project Ref No</th>
                        <th className="p-4">Transmission Payload</th>
                        <th className="p-4">Received Time</th>
                        <th className="p-4 text-right">Operational Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-cloudy/15 text-brand-dusk">
                      {filteredEnquiries.map((e) => (
                        <tr key={e.id} className="hover:bg-brand-blue/[0.01] transition-colors">
                          <td className="p-4 space-y-0.5">
                            <p className="font-semibold text-brand-blue text-sm">{e.name}</p>
                            <p className="text-brand-dusk flex items-center gap-1 font-mono text-[11px]">
                              <Mail size={10} className="text-brand-cloudy" /> {e.email}
                            </p>
                          </td>
                          <td className="p-4">
                            {e.projectNo ? (
                              <span className="font-mono text-brand-blue font-bold tracking-wider text-[11px] bg-brand-topaz/10 px-2.5 py-0.5 rounded">
                                {e.projectNo}
                              </span>
                            ) : (
                              <span className="text-brand-cloudy italic text-[10px]">None specified</span>
                            )}
                          </td>
                          <td className="p-4 max-w-md">
                            <div className="p-3 bg-[#FAF9F5]/60 border border-brand-cloudy/20 rounded text-xs text-brand-blue leading-relaxed max-h-36 overflow-y-auto whitespace-pre-wrap">
                              {e.message}
                            </div>
                          </td>
                          <td className="p-4 text-brand-cloudy font-mono text-[10px]">
                            {formatTimestamp(e.createdAt)}
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => triggerDelete(e.id, 'contactMessages')}
                              className="p-1.5 text-brand-coral hover:bg-brand-coral/5 rounded transition-all cursor-pointer inline-flex items-center"
                              title="Delete Message"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB: NEWSLETTER SUBSCRIBERS */}
            {activeTab === 'newsletter' && (
              <div className="overflow-x-auto">
                {filteredSubscribers.length === 0 ? (
                  <div className="text-center py-16 text-brand-cloudy text-xs">
                    No newsletter subscriber records found.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-brand-cloudy/30 text-brand-blue font-bold uppercase tracking-wide text-[10px]">
                        <th className="p-4">Subscribed Email Address</th>
                        <th className="p-4">Subscription Timestamp</th>
                        <th className="p-4 text-right">Operational Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-cloudy/15 text-brand-dusk">
                      {filteredSubscribers.map((s) => (
                        <tr key={s.id} className="hover:bg-brand-blue/[0.01] transition-colors">
                          <td className="p-4">
                            <p className="font-semibold text-brand-blue text-sm">{s.email}</p>
                          </td>
                          <td className="p-4 text-brand-cloudy font-mono text-[10px]">
                            {formatTimestamp(s.createdAt)}
                          </td>
                          <td className="p-4 text-right">
                            <button 
                              onClick={() => triggerDelete(s.id, 'newsletterSubscribers')}
                              className="p-1.5 text-brand-coral hover:bg-brand-coral/5 rounded transition-all cursor-pointer inline-flex items-center"
                              title="Remove Subscriber"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}

            {/* TAB: BLOG CMS */}
            {activeTab === 'blogs' && (
              <div className="overflow-x-auto">
                {filteredBlogs.length === 0 ? (
                  <div className="text-center py-16 text-brand-cloudy text-xs">
                    No compliance advisory articles found matching the query. Click "New Article" to create one.
                  </div>
                ) : (
                  <table className="w-full text-left border-collapse text-xs">
                    <thead>
                      <tr className="bg-[#FAF9F5] border-b border-brand-cloudy/30 text-brand-blue font-bold uppercase tracking-wide text-[10px]">
                        <th className="p-4">Featured Image</th>
                        <th className="p-4">Article Title & Author</th>
                        <th className="p-4">Category</th>
                        <th className="p-4">State</th>
                        <th className="p-4">Date / Read Time</th>
                        <th className="p-4 text-right">Operational Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-brand-cloudy/15 text-brand-dusk">
                      {filteredBlogs.map((b) => (
                        <tr key={b.id} className="hover:bg-brand-blue/[0.01] transition-colors">
                          <td className="p-4 w-24">
                            <img 
                              src={b.image || '/images/molecular_diagnostics_lab.jpg'} 
                              alt="Article Preview" 
                              className="w-16 h-10 object-cover rounded border border-brand-cloudy/40"
                              referrerPolicy="no-referrer"
                            />
                          </td>
                          <td className="p-4 max-w-sm">
                            <p className="font-semibold text-brand-blue text-sm line-clamp-2">{b.title}</p>
                            <p className="text-brand-dusk text-[11px] flex items-center gap-1 mt-0.5">
                              <span>By {b.author || 'IQzyme Advisor'}</span>
                            </p>
                          </td>
                          <td className="p-4">
                            <span className="bg-brand-blue/5 text-brand-blue font-semibold px-2 py-0.5 rounded text-[11px] border border-brand-blue/10">
                              {b.category}
                            </span>
                          </td>
                          <td className="p-4">
                            {b.published !== false ? (
                              <span className="bg-emerald-50 text-emerald-700 border border-emerald-200 font-semibold px-2.5 py-0.5 rounded text-[10px] flex items-center gap-1 w-max">
                                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full animate-pulse"></span>
                                Published
                              </span>
                            ) : (
                              <span className="bg-gray-100 text-gray-600 border border-gray-200 font-semibold px-2.5 py-0.5 rounded text-[10px] flex items-center gap-1 w-max">
                                <span className="w-1.5 h-1.5 bg-gray-400 rounded-full"></span>
                                Draft
                              </span>
                            )}
                          </td>
                          <td className="p-4 text-brand-cloudy space-y-0.5">
                            <p className="font-mono text-[11px]">{b.date}</p>
                            <p className="text-[10px] italic">{b.readTime || '5 min read'}</p>
                          </td>
                          <td className="p-4 text-right space-x-1">
                            <button 
                              onClick={() => handleOpenEditBlog(b)}
                              className="p-1.5 text-brand-blue hover:bg-brand-blue/5 rounded transition-all cursor-pointer inline-flex items-center"
                              title="Edit Article"
                            >
                              <Pencil size={14} />
                            </button>
                            <button 
                              onClick={() => triggerDelete(b.id, 'blogs')}
                              className="p-1.5 text-brand-coral hover:bg-brand-coral/5 rounded transition-all cursor-pointer inline-flex items-center"
                              title="Delete Article"
                            >
                              <Trash2 size={14} />
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            )}
          </>
        )}
      </div>
    </>
  )}

      {/* Delete Record Confirmation Dialog Modal */}
      {recordToDelete && (
        <div className="fixed inset-0 bg-[#2D3A55]/60 backdrop-blur-sm flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg border border-brand-cloudy/30 shadow-lg max-w-sm w-full p-6 space-y-4">
            <div className="mx-auto w-10 h-10 bg-brand-coral/15 text-brand-coral rounded-full flex items-center justify-center">
              <Trash2 size={20} />
            </div>
            <div className="text-center space-y-2">
              <h3 className="font-display font-medium text-brand-blue text-base">Confirm Permanent Deletion</h3>
              <p className="text-xs text-brand-dusk leading-relaxed">
                Are you absolutely sure you want to delete this record? This action will remove the record permanently from the secure Firestore database.
              </p>
            </div>
            <div className="flex gap-3">
              <button 
                onClick={() => setRecordToDelete(null)}
                className="flex-1 h-9 bg-[#FAF9F5] border border-brand-cloudy/30 rounded text-xs font-semibold text-brand-blue uppercase tracking-wide hover:bg-[#eae8e1] cursor-pointer"
              >
                Cancel
              </button>
              <button 
                onClick={confirmDeleteRecord}
                className="flex-1 h-9 bg-brand-coral hover:bg-brand-coral/90 text-white rounded text-xs font-semibold uppercase tracking-wide cursor-pointer"
              >
                Delete Record
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Blog Article Editor overlay form */}
      {blogFormOpen && (
        <div className="fixed inset-0 bg-[#2D3A55]/70 backdrop-blur-sm flex items-center justify-center p-4 z-50 overflow-y-auto">
          <div className="bg-white rounded-xl border border-brand-cloudy/30 shadow-2xl max-w-2xl w-full my-8 flex flex-col max-h-[90vh]">
            {/* Header */}
            <div className="bg-[#2D3A55] p-5 text-white flex items-center justify-between rounded-t-xl shrink-0">
              <div className="flex items-center gap-2">
                <BookOpen size={20} className="text-[#00C4B7]" />
                <h3 className="font-display font-medium text-base">
                  {editingBlog ? 'Modify Compliance Advisory Article' : 'Draft New Compliance Advisory'}
                </h3>
              </div>
              <button 
                onClick={() => setBlogFormOpen(false)}
                className="text-brand-cloudy hover:text-white transition-all text-sm uppercase tracking-wider font-bold cursor-pointer font-sans"
              >
                ✕
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSaveBlog} className="p-6 overflow-y-auto space-y-5 flex-1">
              {/* Row 1: Title & Category */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Article Title *</label>
                  <input 
                    type="text" 
                    required
                    value={blogTitle}
                    onChange={(e) => setBlogTitle(e.target.value)}
                    placeholder="e.g. Navigating MD-14 CDSCO Inspections"
                    className="w-full h-10 px-3 bg-[#FAF9F5]/20 border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-xs transition-all"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Category Classification *</label>
                  <select 
                    value={blogCategory}
                    onChange={(e) => setBlogCategory(e.target.value)}
                    className="w-full h-10 px-3 bg-white border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-xs transition-all"
                  >
                    <option value="CDSCO Licensing">CDSCO Licensing</option>
                    <option value="WHO-PQ Advisory">WHO-PQ Advisory</option>
                    <option value="MD-14 Turnkey Projects">MD-14 Turnkey Projects</option>
                    <option value="Clinical Evaluation">Clinical Evaluation</option>
                    <option value="Quality Management Systems (QMS)">Quality Management Systems (QMS)</option>
                    <option value="ISO 13485 Compliance">ISO 13485 Compliance</option>
                    <option value="Global Audits">Global Audits</option>
                  </select>
                </div>
              </div>

              {/* Row 2: Author & Read Time & Date */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Author Identity *</label>
                  <input 
                    type="text" 
                    required
                    value={blogAuthor}
                    onChange={(e) => setBlogAuthor(e.target.value)}
                    className="w-full h-10 px-3 bg-[#FAF9F5]/20 border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-xs transition-all"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Est. Read Time *</label>
                  <input 
                    type="text" 
                    required
                    value={blogReadTime}
                    onChange={(e) => setBlogReadTime(e.target.value)}
                    className="w-full h-10 px-3 bg-[#FAF9F5]/20 border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-xs transition-all"
                  />
                </div>
                <div className="space-y-1.5 text-left">
                  <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Publish Date</label>
                  <input 
                    type="text" 
                    value={blogDate}
                    onChange={(e) => setBlogDate(e.target.value)}
                    placeholder="e.g. July 6, 2026"
                    className="w-full h-10 px-3 bg-[#FAF9F5]/20 border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-xs transition-all"
                  />
                </div>
              </div>

              {/* Row 3: Image Upload & Preview */}
              <div className="space-y-2 text-left">
                <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Featured Cover Image</label>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {/* File Upload Trigger */}
                  <div className="md:col-span-2 border-2 border-dashed border-brand-cloudy/50 rounded-lg p-4 bg-[#FAF9F5]/25 flex flex-col items-center justify-center text-center space-y-2 hover:border-brand-topaz transition-all cursor-pointer relative"
                    onClick={() => fileInputRef.current?.click()}
                  >
                    <CloudUpload size={24} className={isUploading ? "text-[#00C4B7] animate-bounce" : "text-brand-cloudy"} />
                    <p className="text-[11px] font-semibold text-brand-blue">
                      {isUploading ? "Uploading file..." : "Drag & drop cover photo or select to upload"}
                    </p>
                    <p className="text-[9px] text-brand-dusk font-mono">Accepts JPG, PNG, WEBP (Max 5MB)</p>
                    <input 
                      type="file" 
                      ref={fileInputRef}
                      onChange={handleImageUpload}
                      accept="image/*"
                      className="hidden" 
                    />
                    
                    {/* Progress indicator */}
                    {uploadProgress !== null && (
                      <div className="w-full bg-brand-cloudy/30 rounded-full h-1.5 mt-2 overflow-hidden">
                        <div 
                          className="bg-[#00C4B7] h-1.5 rounded-full transition-all duration-300" 
                          style={{ width: `${uploadProgress}%` }}
                        ></div>
                      </div>
                    )}
                  </div>

                  {/* Image Preview / URL Input */}
                  <div className="flex flex-col justify-between space-y-2">
                    <div className="border border-brand-cloudy/30 rounded bg-brand-cloudy/5 h-24 flex items-center justify-center overflow-hidden">
                      {blogImage ? (
                        <img 
                          src={blogImage} 
                          alt="Cover preview" 
                          className="w-full h-full object-cover"
                          referrerPolicy="no-referrer"
                        />
                      ) : (
                        <Image size={20} className="text-brand-cloudy" />
                      )}
                    </div>
                    {/* Direct URL path input in case upload fails or is skipped */}
                    <input 
                      type="text"
                      placeholder="Or paste direct image URL..."
                      value={blogImage}
                      onChange={(e) => setBlogImage(e.target.value)}
                      className="w-full h-8 px-2 bg-white border border-brand-cloudy/50 focus:ring-brand-topaz rounded focus:outline-none focus:ring-1 text-[10px] transition-all"
                    />
                  </div>
                </div>
                {uploadError && (
                  <p className="text-[10px] text-brand-coral flex items-center gap-1 font-semibold">
                    <AlertTriangle size={12} />
                    <span>{uploadError}</span>
                  </p>
                )}
              </div>

              {/* Row 4: Article Excerpt / Short Summary */}
              <div className="space-y-1.5 text-left">
                <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Short Excerpt / Synopsis *</label>
                <textarea 
                  required
                  rows={2}
                  value={blogExcerpt}
                  onChange={(e) => setBlogExcerpt(e.target.value)}
                  placeholder="Summarize the core theme of the article in 2 sentences..."
                  className="w-full p-3 bg-[#FAF9F5]/20 border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-xs transition-all leading-relaxed"
                />
              </div>

              {/* Row 5: Article Body (Markdown supported) */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-center">
                  <label className="block text-[10px] font-semibold text-brand-blue uppercase tracking-wide">Article Body (Markdown Supported) *</label>
                  <span className="text-[9px] text-brand-cloudy font-mono">Use standard markdown formatting</span>
                </div>
                <textarea 
                  required
                  rows={10}
                  value={blogContent}
                  onChange={(e) => setBlogContent(e.target.value)}
                  placeholder="# Background&#13;Write introduction here...&#13;&#13;## Regulatory Standards&#13;- Standard 1&#13;- Standard 2"
                  className="w-full p-3 bg-[#FAF9F5]/20 border border-brand-cloudy/60 focus:ring-brand-topaz rounded focus:outline-none focus:ring-2 text-xs font-mono transition-all leading-relaxed"
                />
              </div>

              {/* Row 6: Status Toggle (Publish vs Draft) */}
              <div className="p-4 bg-[#FAF9F5]/40 rounded-lg border border-brand-cloudy/25 flex items-center justify-between text-left">
                <div>
                  <p className="text-xs font-semibold text-brand-blue">Publish Immediately?</p>
                  <p className="text-[10px] text-brand-dusk">If disabled, this article is preserved as a 'Draft' and hidden from client views.</p>
                </div>
                <button
                  type="button"
                  onClick={() => setBlogPublished(!blogPublished)}
                  className={`w-12 h-6 rounded-full p-0.5 transition-colors cursor-pointer ${blogPublished ? 'bg-[#00C4B7]' : 'bg-brand-cloudy/40'}`}
                >
                  <div className={`w-5 h-5 bg-white rounded-full shadow-sm transform transition-transform duration-200 ${blogPublished ? 'translate-x-6' : 'translate-x-0'}`}></div>
                </button>
              </div>

              {/* Controls */}
              <div className="flex gap-3 pt-2 shrink-0">
                <button 
                  type="button"
                  onClick={() => setBlogFormOpen(false)}
                  className="flex-1 h-10 bg-[#FAF9F5] border border-brand-cloudy/30 rounded text-xs font-bold text-brand-blue uppercase tracking-wider hover:bg-[#eae8e1] transition-all cursor-pointer"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  disabled={isUploading}
                  className="flex-1 h-10 bg-[#2D3A55] hover:bg-[#1e273a] text-white rounded text-xs font-bold uppercase tracking-wider transition-all cursor-pointer disabled:opacity-50 flex items-center justify-center gap-2"
                >
                  {loadingData ? 'Saving...' : editingBlog ? 'Update Advisory' : 'Publish Advisory'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
