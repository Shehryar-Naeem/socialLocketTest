// import AsyncStorage from "@react-native-async-storage/async-storage"

/**
 * Loads a string from storage.
 *
 * @param key The key to fetch.
 */
export function loadString(key) {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
}

/**
 * Saves a string to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function saveString(key, value) {
  try {
    localStorage.setItem(key, value);
    return true;
  } catch {
    return false;
  }
}

/**
 * Saves an object to storage.
 *
 * @param key The key to fetch.
 * @param value The value to store.
 */
export function save(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

/**
 * Removes something from storage.
 *
 * @param key The key to kill.
 */
export function remove(key) {
  try {
    localStorage.removeItem(key);
    localStorage.removeItem('password_social_locket');
  } catch (err) {
    console.log(err);
  }
}

/**
 * Burn it all to the ground.
 */
export function clear() {
  try {
    localStorage.clear();
    localStorage.removeItem('password_social_locket');

  } catch (err) {
    console.log(err);
  }
}

/**
 * Get User bio from storage.
 *
 */
export function hasUserDetails() {
  try {
    const user = loadString('userDetails');
    if (user) {
      return true;
    }
  } catch (err) {
    console.log(err);
  }
  return false;
}

/**
 * Get User Id from storage.
 *
 */
export function getUserId() {
  try {
    const user = loadString('userDetails');
    if (user) {
      const userData = JSON.parse(user);
      return userData?.id;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}

/**
 * Get User Profile Image from storage.
 *
 */
export function getUserProfileImage() {
  try {
    const user = loadString('userDetails');
    if (user) {
      const userData = JSON.parse(user);
      return userData?.profile_image;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}

/**
 * Get User Full Name from storage.
 *
 */
export function getUserFullName() {
  try {
    const user = loadString('userDetails');
    if (user) {
      const userData = JSON.parse(user);
      return `${userData?.forename} ${userData?.surname}`;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}

/**
 * Get User bio from storage.
 *
 */
export function getUserBio() {
  try {
    const user = loadString('userDetails');
    if (user) {
      const userData = JSON.parse(user);
      return userData?.bio;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}

export function getUserEmail() {
  try {
    const user = loadString('userDetails');
    if (user) {
      const userData = JSON.parse(user);
      return userData?.email;
    }
  } catch (err) {
    console.log(err);
  }
  return null;
}
