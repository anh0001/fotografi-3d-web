// import * as firebase from 'firebase/app';
// import ReduxSagaFirebase from 'redux-saga-firebase';

// import 'firebase/auth';
// import 'firebase/database';
// import 'firebase/storage';


// const firebaseApp = firebase.initializeApp(firebaseConfig);

// export const firebaseDb = firebase.database();
// export const firebaseSocialAuth = firebase.auth();
// export const rsf = new ReduxSagaFirebase(firebaseApp);
// export const firebaseAuth = rsf.auth;

// export default firebaseApp;


import firebase from 'firebase/app';
import ReduxSagaFirebase from 'redux-saga-firebase';
import 'firebase/auth';
import 'firebase/firestore';
import 'firebase/storage';
import 'firebase/database';
import articleStatus from 'enl-api/apps/articleStatus';
import projectStatus from 'enl-api/apps/projectStatus';

// Uncomment this for production
import firebaseConfig from './config';

// const firebaseConfig = {
//     apiKey: process.env.FIREBASE_API_KEY,
//     authDomain: process.env.FIREBASE_AUTH_DOMAIN,
//     databaseURL: process.env.FIREBASE_DB_URL,
//     projectId: process.env.FIREBASE_PROJECT_ID,
//     storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
//     messagingSenderId: process.env.FIREBASE_MSG_SENDER_ID,
//     appId: process.env.FIREBASE_APP_ID
// };

class Firebase {
  constructor() {
    this.app = firebase.initializeApp(firebaseConfig);

    this.rsf = new ReduxSagaFirebase(this.app);
    this.auth = this.rsf.auth;
    // this.auth = firebase.auth();
    this.storage = firebase.storage();
    this.dbFirestore = firebase.firestore();
    this.db = firebase.database();
  }

  // AUTH ACTIONS
  // --------

  createAccount = (email, password) => this.auth.createUserWithEmailAndPassword(email, password);

  signIn = (email, password) => this.auth.signInWithEmailAndPassword(email, password);

  signInWithGoogle = () => this.auth.signInWithPopup(new firebase.auth.GoogleAuthProvider());

  signInWithFacebook = () => this.auth.signInWithPopup(new firebase.auth.FacebookAuthProvider());

  signInWithGithub = () => this.auth.signInWithPopup(new firebase.auth.GithubAuthProvider());

  signOut = () => this.auth.signOut();

  passwordReset = email => this.auth.sendPasswordResetEmail(email);

  addUser = (id, user) => {
    // const user = {
    //     username: credential.username,
    //     userId: credential.uid,
    //     fullname: credential.fullname,
    //     avatar: '',
    //     banner: '',
    //     email: credential.email,
    //     address: '',
    //     mobile: {},
    //     userType: credential.userType,
    //     description: '',
    //     birthDate: '',
    //     location: '',
    //     dateJoined: credential.dateJoined
    // };

    this.dbFirestore.collection('users').doc(id).set(user);

    // Update read-only users info
    const readOnlyUserInfo = {
      username: user.username,
      fullname: user.fullname,
      name: user.name,
      avatar: user.avatar,
      banner: '',
      email: user.email,
      address: '',
      userType: user.userType,
      description: '',
      birthDate: '',
      location: '',
      dateJoined: user.dateJoined
    };
    this.dbFirestore.collection('readOnlyUsersInfo').doc(user.username).set(readOnlyUserInfo);

    return true;
  }

  getUser = id => this.dbFirestore.collection('users').doc(id).get();

  // Check if the username is already taken in the database
  isUsernameExist = async (username) => {
    const query = this.dbFirestore.collection('readOnlyUsersInfo').where('username', '==', username);
    const snapshot = await query.get();
    // console.log('snapshot: ', snapshot.size);
    if (snapshot.size > 0) // If it found existing username
    { return true; }

    return false;
  }

  passwordUpdate = password => this.auth.currentUser.updatePassword(password);

  changePassword = (currentPassword, newPassword) => new Promise((resolve, reject) => {
    this.reauthenticate(currentPassword).then(() => {
      const user = this.auth.currentUser;
      user.updatePassword(newPassword).then(() => {
        resolve('Password updated successfully!');
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  })

  reauthenticate = (currentPassword) => {
    const user = this.auth.currentUser;
    const cred = firebase.auth.EmailAuthProvider.credential(user.email, currentPassword);

    return user.reauthenticateWithCredential(cred);
  }

  updateEmail = (currentPassword, newEmail) => new Promise((resolve, reject) => {
    this.reauthenticate(currentPassword).then(() => {
      const user = this.auth.currentUser;
      user.updateEmail(newEmail).then((data) => {
        resolve('Email Successfully updated');
      }).catch(error => reject(error));
    }).catch(error => reject(error));
  })

  updateProfile = (id, updates) => this.dbFirestore.collection('users').doc(id).update(updates);

  onAuthStateChanged = () => new Promise((resolve, reject) => {
    this.auth.onAuthStateChanged((user) => {
      if (user) {
        return resolve(user);
      }
      return reject(new Error('Auth State Changed failed'));
    });
  })

  setAuthPersistence = () => this.auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

  // // PRODUCT ACTIONS
  // // ---------

  getProducts = (lastRefKey) => {
    let didTimeout = false;

    return new Promise(async (resolve, reject) => {
      if (lastRefKey) {
        try {
          const query = this.dbFirestore.collectionGroup('productsInfo').orderBy(firebase.firestore.FieldPath.documentId()).startAfter(lastRefKey).limit(100);
          const snapshot = await query.get();
          const products = [];
          snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
          const lastKey = snapshot.docs[snapshot.docs.length - 1];

          resolve({ products, lastKey });
        } catch (e) {
          reject(':( Failed to fetch products.');
        }
      } else {
        const timeout = setTimeout(() => {
          didTimeout = true;
          reject('Request timeout, please try again');
        }, 15000);

        try {
          // getting the total count of data

          // adding shallow parameter for smaller response size
          // better than making a query from firebase
          // NOT AVAILEBLE IN FIRESTORE const request = await fetch(`${process.env.FIREBASE_DB_URL}/products.json?shallow=true`);

          const totalQuery = await this.dbFirestore.collectionGroup('productsInfo').get();
          const total = totalQuery.docs.length;
          const query = this.dbFirestore.collectionGroup('productsInfo').orderBy(firebase.firestore.FieldPath.documentId()).limit(100);
          const snapshot = await query.get();

          // console.log('snapshot: ', total);

          clearTimeout(timeout);
          if (!didTimeout) {
            const products = [];
            snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
            const lastKey = snapshot.docs[snapshot.docs.length - 1];

            resolve({ products, lastKey, total });
          }
        } catch (e) {
          if (didTimeout) return;
          console.log('Failed to fetch products: An error occured while trying to fetch products or there may be no product ', e);
          reject(':( Failed to fetch products.');
        }
      }
    });
  }

  getUserProducts = (userId, lastRefKey) => {
    let didTimeout = false;

    return new Promise(async (resolve, reject) => {
      if (lastRefKey) {
        try {
          const query = this.dbFirestore.collection('allProducts').doc(userId).collection('productsInfo').orderBy(firebase.firestore.FieldPath.documentId())
            .startAfter(lastRefKey)
            .limit(100);
          const snapshot = await query.get();
          const products = [];
          snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
          const lastKey = snapshot.docs[snapshot.docs.length - 1];

          resolve({ products, lastKey });
        } catch (e) {
          reject(':( Failed to fetch products.');
        }
      } else {
        const timeout = setTimeout(() => {
          didTimeout = true;
          reject('Request timeout, please try again');
        }, 15000);

        try {
          // getting the total count of data

          // adding shallow parameter for smaller response size
          // better than making a query from firebase
          // NOT AVAILEBLE IN FIRESTORE const request = await fetch(`${process.env.FIREBASE_DB_URL}/products.json?shallow=true`);

          const totalQuery = await this.dbFirestore.collection('allProducts').doc(userId).collection('productsInfo').get();
          const total = totalQuery.docs.length;
          const query = this.dbFirestore.collection('allProducts').doc(userId).collection('productsInfo').orderBy(firebase.firestore.FieldPath.documentId())
            .limit(100);
          const snapshot = await query.get();

          // console.log('snapshot: ', snapshot);

          clearTimeout(timeout);
          if (!didTimeout) {
            const products = [];
            snapshot.forEach(doc => products.push({ id: doc.id, ...doc.data() }));
            const lastKey = snapshot.docs[snapshot.docs.length - 1];

            resolve({ products, lastKey, total });
          }
        } catch (e) {
          if (didTimeout) return;
          console.log('Failed to fetch products: An error occured while trying to fetch products or there may be no product ', e);
          reject(':( Failed to fetch products.');
        }
      }
    });
  }

  // We define an async function
  getProductsUsingUsername = async (username) => {
    const dataMatchUsername = this.dbFirestore.collectionGroup('productsInfo').where('username', '==', username).get();

    const [dataMatchUsernameSnapshot, dataMatchLabUsernameSnapshot] = await Promise.all([
      dataMatchUsername
    ]);

    const dataMatchUsernameArray = dataMatchUsernameSnapshot.docs;

    const productsArray = dataMatchUsernameArray;

    const products = [];
    productsArray.forEach(doc => products.push({ ...doc.data() }));

    return products;
  }

  newProduct = async (userid, productId, item) => {
    const docRef = this.dbFirestore.collection('allProducts').doc(userid).collection('productsInfo').doc(productId);
    await docRef.set(item);
  }

  editProduct = (userid, productid, item) => (
    this.dbFirestore.collection('allProducts').doc(userid).collection('productsInfo').doc(productid)
      .update(item)
  )

  generateKey = () => this.dbFirestore.collection('products').doc().id;

  storeImage = async (userid, folder, imageFile) => {
    const snapshot = await this.storage.ref(folder).child(userid).put(imageFile);
    const downloadURL = await snapshot.ref.getDownloadURL();

    return downloadURL;
  }

  storeImages = async (folder, imageFiles) => {
    let urls = [];

    const asyncRes = await Promise.all(imageFiles.map(async (media, index) => {
      const snapshot = await this.storage.ref(folder).child(index.toString()).put(media.file);
      const downloadURL = await snapshot.ref.getDownloadURL();
      urls = [...urls, downloadURL];
    }));

    return [...urls];
  }

  deleteImage = id => this.storage.ref('products').child(id).delete();

  removeProduct = (userid, productid) => this.dbFirestore.collection('allProducts').doc(userid).collection('productsInfo').doc(productid)
    .delete();

  // // ARTICLE ACTIONS
  // // ---------

  newArticle = async (userId, articleId, item) => {
    const docRef = this.dbFirestore.collection('allPosts').doc(userId).collection('articlesInfo').doc(articleId);
    await docRef.set(item);
  }

  editArticle = async (userId, articleId, item) => {
    const res = this.dbFirestore.collection('allPosts').doc(userId).collection('articlesInfo').doc(articleId)
      .update(item);
    return res.id;
  }

  // updateArticle = async (userId, articleId, item) => {
  //     try {
  //         const query = this.dbFirestore.collectionGroup('articlesInfo')
  //             .where('articleId', '==', articleId)
  //             .limit(1);
  //         const querySnapshot = await query.get();
  //         if (querySnapshot.empty) return false;
  //         const queryDocumentSnapshot = querySnapshot.docs[0];
  //         queryDocumentSnapshot.ref.update(item).then(() => {return true;});

  //     } catch (e) {
  //         console.log('Error in updateArticle', e);
  //     }

  //     return false;
  // }

  _deleteStorageFolderContents(path) {
    const ref = firebase.storage().ref(path);
    ref.listAll()
      .then(dir => {
        dir.items.forEach(fileRef => {
          this._deleteStorageFile(ref.fullPath, fileRef.name);
        });
        dir.prefixes.forEach(folderRef => {
          this._deleteStorageFolderContents(folderRef.fullPath);
        });
      })
      .catch(error => {
        console.log(error);
      });
  }

  _deleteStorageFile(pathToFile, fileName) {
    const ref = firebase.storage().ref(pathToFile);
    const childRef = ref.child(fileName);
    childRef.delete();
  }


  removeArticle = async (userid, username, articleid) => {
    const storageFolder = 'allposts/' + username + '/' + articleid + '/';
    this.dbFirestore.collection('allPosts').doc(userid).collection('articlesInfo').doc(articleid)
      .delete();
    this._deleteStorageFolderContents(storageFolder);
  }

  getArticleUsingId = (articleId, status = '') => {
    let didTimeout = false;

    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        didTimeout = true;
        reject('Request timeout, please try again');
      }, 15000);

      try {
        let query = null;
        if (!status) {
          query = this.dbFirestore.collectionGroup('articlesInfo')
            .where('articleId', '==', articleId);
        } else {
          query = this.dbFirestore.collectionGroup('articlesInfo')
            .where('articleId', '==', articleId)
            .where('status', '==', status);
        }
        const snapshot = await query.get();

        clearTimeout(timeout);
        const articles = [];

        if (!didTimeout && snapshot.size > 0) {
          snapshot.forEach(doc => articles.push({ id: doc.id, ...doc.data() }));
        }
        resolve({ articles });
      } catch (e) {
        if (didTimeout) return;
        console.log('Failed to fetch articles: An error occured while trying to fetch articles or there may be no article ', e);
        reject(':( Failed to fetch articles.');
      }
    });
  }


  getArticles = (lastRefKey) => {
    let didTimeout = false;

    return new Promise(async (resolve, reject) => {
      if (lastRefKey) {
        try {
          const query = this.dbFirestore.collectionGroup('articlesInfo')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .where('status', '==', articleStatus.published)
            .startAfter(lastRefKey)
            .limit(100);
          const snapshot = await query.get();
          const articles = [];
          snapshot.forEach(doc => articles.push({ id: doc.id, ...doc.data() }));
          const lastKey = snapshot.docs[snapshot.docs.length - 1];

          resolve({ articles, lastKey });
        } catch (e) {
          reject(':( Failed to fetch articles.');
        }
      } else {
        const timeout = setTimeout(() => {
          didTimeout = true;
          reject('Request timeout, please try again');
        }, 15000);

        try {
          // getting the total count of data

          // adding shallow parameter for smaller response size
          // better than making a query from firebase
          // NOT AVAILEBLE IN FIRESTORE const request = await fetch(`${process.env.FIREBASE_DB_URL}/products.json?shallow=true`);

          const totalQuery = await this.dbFirestore.collectionGroup('articlesInfo').where('status', '==', articleStatus.published).get();
          const total = totalQuery.docs.length;
          const query = this.dbFirestore.collectionGroup('articlesInfo')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .where('status', '==', articleStatus.published)
            .limit(100);
          const snapshot = await query.get();

          // console.log('snapshot: ', total);

          clearTimeout(timeout);
          if (!didTimeout) {
            const articles = [];
            snapshot.forEach(doc => articles.push({ id: doc.id, ...doc.data() }));
            const lastKey = snapshot.docs[snapshot.docs.length - 1];

            resolve({ articles, lastKey, total });
          }
        } catch (e) {
          if (didTimeout) return;
          console.log('Failed to fetch articles: An error occured while trying to fetch articles or there may be no article ', e);
          reject(':( Failed to fetch articles.');
        }
      }
    });
  }

  // We define an async function
  getArticlesUsingUsername = async (username) => {
    const dataMatchUsername = this.dbFirestore.collectionGroup('articlesInfo').where('username', '==', username).get();
    const dataMatchLabUsername = this.dbFirestore.collectionGroup('articlesInfo').where('labUsername', '==', username).get();

    const [dataMatchUsernameSnapshot, dataMatchLabUsernameSnapshot] = await Promise.all([
      dataMatchUsername,
      dataMatchLabUsername
    ]);

    const dataMatchUsernameArray = dataMatchUsernameSnapshot.docs;
    const dataMatchLabUsernameArray = dataMatchLabUsernameSnapshot.docs;

    const articlesArray = dataMatchUsernameArray.concat(dataMatchLabUsernameArray);

    const articles = [];
    articlesArray.forEach(doc => articles.push({ ...doc.data() }));

    return articles;
  }

  getUserArticles = (userId, lastRefKey) => {
    let didTimeout = false;

    return new Promise(async (resolve, reject) => {
      if (lastRefKey) {
        try {
          const query = this.dbFirestore.collection('allPosts').doc(userId).collection('articlesInfo').orderBy(firebase.firestore.FieldPath.documentId())
            .startAfter(lastRefKey)
            .limit(100);
          const snapshot = await query.get();
          const articles = [];
          snapshot.forEach(doc => articles.push({ id: doc.id, ...doc.data() }));
          const lastKey = snapshot.docs[snapshot.docs.length - 1];

          resolve({ articles, lastKey });
        } catch (e) {
          reject(':( Failed to fetch articles.');
        }
      } else {
        const timeout = setTimeout(() => {
          didTimeout = true;
          reject('Request timeout, please try again');
        }, 15000);

        try {
          // getting the total count of data

          // adding shallow parameter for smaller response size
          // better than making a query from firebase
          // NOT AVAILEBLE IN FIRESTORE const request = await fetch(`${process.env.FIREBASE_DB_URL}/products.json?shallow=true`);

          const totalQuery = await this.dbFirestore.collection('allPosts').doc(userId).collection('articlesInfo').get();
          const total = totalQuery.docs.length;
          const query = this.dbFirestore.collection('allPosts').doc(userId).collection('articlesInfo').orderBy(firebase.firestore.FieldPath.documentId())
            .limit(100);
          const snapshot = await query.get();

          // console.log('snapshot: ', snapshot);

          clearTimeout(timeout);
          if (!didTimeout) {
            const articles = [];
            snapshot.forEach(doc => articles.push({ id: doc.id, ...doc.data() }));
            const lastKey = snapshot.docs[snapshot.docs.length - 1];

            resolve({ articles, lastKey, total });
          }
        } catch (e) {
          if (didTimeout) return;
          console.log('Failed to fetch articles: An error occured while trying to fetch articles or there may be no article ', e);
          reject(':( Failed to fetch articles.');
        }
      }
    });
  }

  // // PROJECT ACTIONS
  // // ---------

  newProject = async (userId, projectId, item) => {
    const res = this.dbFirestore.collection('allProjects').doc(userId).collection('projectsInfo').doc(projectId)
      .set(item);
    return res.id;
  }

  editProject = async (userId, projectId, item) => {
    const res = this.dbFirestore.collection('allProjects').doc(userId).collection('projectsInfo').doc(projectId)
      .update(item);
    return res.id;
  }

  removeProject = async (userid, username, projectId) => {
    const storageFolder = 'allProjects/' + username + '/' + projectId + '/';
    this.dbFirestore.collection('allProjects').doc(userid).collection('projectsInfo').doc(projectId)
      .delete();
    this._deleteStorageFolderContents(storageFolder);
  }

  getProjectUsingId = (projectId, status = '') => {
    let didTimeout = false;

    return new Promise(async (resolve, reject) => {
      const timeout = setTimeout(() => {
        didTimeout = true;
        reject('Request timeout, please try again');
      }, 15000);

      try {
        let query = null;
        if (!status) {
          query = this.dbFirestore.collectionGroup('projectsInfo')
            .where('projectId', '==', projectId);
        } else {
          query = this.dbFirestore.collectionGroup('projectsInfo')
            .where('projectId', '==', projectId)
            .where('status', '==', status);
        }
        const snapshot = await query.get();

        clearTimeout(timeout);
        const projects = [];

        if (!didTimeout && snapshot.size > 0) {
          snapshot.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));
        }
        resolve({ projects });
      } catch (e) {
        if (didTimeout) return;
        console.log('Failed to fetch projects: An error occured while trying to fetch projects or there may be no project ', e);
        reject(':( Failed to fetch projects.');
      }
    });
  }

  getProjects = (lastRefKey) => {
    let didTimeout = false;

    return new Promise(async (resolve, reject) => {
      if (lastRefKey) {
        try {
          const query = this.dbFirestore.collectionGroup('projectsInfo')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .where('status', 'in', [projectStatus.ongoing, projectStatus.finished])
            .startAfter(lastRefKey)
            .limit(100);
          const snapshot = await query.get();
          const projects = [];
          snapshot.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));
          const lastKey = snapshot.docs[snapshot.docs.length - 1];

          resolve({ projects, lastKey });
        } catch (e) {
          reject(':( Failed to fetch projects.');
        }
      } else {
        const timeout = setTimeout(() => {
          didTimeout = true;
          reject('Request timeout, please try again');
        }, 15000);

        try {
          // getting the total count of data

          // adding shallow parameter for smaller response size
          // better than making a query from firebase
          // NOT AVAILEBLE IN FIRESTORE const request = await fetch(`${process.env.FIREBASE_DB_URL}/products.json?shallow=true`);

          const totalQuery = await this.dbFirestore.collectionGroup('projectsInfo').where('status', 'in', [projectStatus.ongoing, projectStatus.finished]).get();
          const total = totalQuery.docs.length;
          const query = this.dbFirestore.collectionGroup('projectsInfo')
            .orderBy(firebase.firestore.FieldPath.documentId())
            .where('status', 'in', [projectStatus.ongoing, projectStatus.finished])
            .limit(100);
          const snapshot = await query.get();

          // console.log('snapshot: ', total);

          clearTimeout(timeout);
          if (!didTimeout) {
            const projects = [];
            snapshot.forEach(doc => projects.push({ id: doc.id, ...doc.data() }));
            const lastKey = snapshot.docs[snapshot.docs.length - 1];

            resolve({ projects, lastKey, total });
          }
        } catch (e) {
          if (didTimeout) return;
          console.log('Failed to fetch projects: An error occured while trying to fetch projects or there may be no project ', e);
          reject(':( Failed to fetch projects.');
        }
      }
    });
  }

  getProjectsUsingUsername = async (username) => {
    const dataMatchUsername = this.dbFirestore.collectionGroup('projectsInfo').where('username', '==', username).get();
    const dataMatchLabUsername = this.dbFirestore.collectionGroup('projectsInfo').where('labUsername', '==', username).get();

    const [dataMatchUsernameSnapshot, dataMatchLabUsernameSnapshot] = await Promise.all([
      dataMatchUsername,
      dataMatchLabUsername
    ]);

    const dataMatchUsernameArray = dataMatchUsernameSnapshot.docs;
    const dataMatchLabUsernameArray = dataMatchLabUsernameSnapshot.docs;

    const projectsArray = dataMatchUsernameArray.concat(dataMatchLabUsernameArray);

    const projects = [];
    projectsArray.forEach(doc => projects.push({ ...doc.data() }));

    return projects;
  }
}

export default Firebase;
