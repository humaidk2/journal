package com.rn_journal; // replace com.your-app-name with your app’s name
import android.os.Build;
import android.os.Environment;
import android.util.Base64;
import android.util.Log;
import android.widget.Toast;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.io.File;
import java.io.FileInputStream;
import java.io.FileNotFoundException;
import java.io.FileOutputStream;
import java.io.IOException;
import java.math.BigInteger;
import java.security.InvalidAlgorithmParameterException;
import java.security.InvalidKeyException;
import java.security.Key;
import java.security.KeyStore;
import java.security.KeyStoreException;
import java.security.NoSuchAlgorithmException;
import java.security.NoSuchProviderException;
import java.security.UnrecoverableEntryException;
import java.security.UnrecoverableKeyException;
import java.security.cert.CertificateException;
import java.security.SecureRandom;
import java.security.spec.InvalidKeySpecException;
import java.util.Enumeration;
import java.util.Map;
import java.util.HashMap;

import javax.crypto.BadPaddingException;
import javax.crypto.Cipher;
import javax.crypto.IllegalBlockSizeException;
import javax.crypto.KeyGenerator;
import javax.crypto.NoSuchPaddingException;
import javax.crypto.SecretKey;
import javax.crypto.spec.IvParameterSpec;
import javax.crypto.spec.SecretKeySpec;


import javax.crypto.spec.PBEKeySpec;
import javax.crypto.SecretKeyFactory;

import androidx.annotation.NonNull;
import androidx.annotation.RequiresApi;

public class KeyStoreModule extends ReactContextBaseJavaModule {

    public static final String PBKDF2_ALGORITHM = "PBKDF2WithHmacSHA256";

    // The following constants may be changed without breaking existing hashes.
    public static final int SALT_BYTES = 32;
    public static final int HASH_BYTES = 32;
    public static final int PBKDF2_ITERATIONS = 10000;

    public static final int ITERATION_INDEX = 0;
    public static final int SALT_INDEX = 1;
    public static final int PBKDF2_INDEX = 2;
    public static final String CIPHER_ALGORITHM = "AES/CBC/PKCS5Padding";
    public static final String KEY_SPEC_ALGORITHM = "AES";
    public static final String PROVIDER = "BC";
    public static final String SECRET_KEY = "SECRET_KEY";
    public static final int OUTPUT_KEY_LENGTH = 256;
    public static final int OUTPUT_IV_LENGTH = 128;

    KeyStoreModule(ReactApplicationContext context) {

        super(context);
    }

    @ReactMethod
    public void setKey(String alias, String kPassword, String dataKey) {
        //
        try {
            KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());
            // get user password and file input stream
            char[] password = kPassword.toCharArray();
            ks.load(null);
//            try (FileInputStream fis = new FileInputStream("keyStoreName")) {
//                ks.load(fis, password);
//            }

            KeyStore.ProtectionParameter protParam =
                    new KeyStore.PasswordProtection(password);
            // decode the base64 encoded string
            byte[] decodedKey = dataKey.getBytes("UTF-8");//Base64.getDecoder().decode(dataKey);
            // rebuild key using SecretKeySpec
            SecretKey mySecretKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, "AES");
            KeyStore.SecretKeyEntry skEntry = new KeyStore.SecretKeyEntry(mySecretKey);
            ks.setEntry(alias, skEntry, protParam);
            try (FileOutputStream fos = new FileOutputStream(new File(Environment.getExternalStorageDirectory().getAbsolutePath(),"keyStoreName"), false)) {
                ks.store(fos, password);
            }
        } catch (KeyStoreException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
        e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (CertificateException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }
    @ReactMethod
    public String getKey(String alias, String kPassword, Promise promise) {
        try {
            KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());

            // get user password and file input stream
            char[] password = kPassword.toCharArray();
            try (FileInputStream fis = new FileInputStream(new File(Environment.getExternalStorageDirectory().getAbsolutePath(),"keyStoreName"))) {
                ks.load(fis, password);
            }
            KeyStore.ProtectionParameter protParam =
                    new KeyStore.PasswordProtection(password);
            KeyStore.SecretKeyEntry secretKeyEntry = (KeyStore.SecretKeyEntry) ks.getEntry(alias, protParam);
            SecretKey secretKey = secretKeyEntry.getSecretKey();
            String encodedKey = new String(secretKey.getEncoded(), "UTF-8");//Base64.getEncoder().encodeToString(secretKey.getEncoded());
            promise.resolve(encodedKey);
        } catch (KeyStoreException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (CertificateException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (UnrecoverableKeyException e) {
            e.printStackTrace();
        } catch (UnrecoverableEntryException e) {
            e.printStackTrace();
        }
        return "failure";
    }
    @ReactMethod
    public void deleteKey(String alias, String kPassword) {
        try {
            KeyStore ks = KeyStore.getInstance(KeyStore.getDefaultType());

            // get user password and file input stream
            char[] password = kPassword.toCharArray();
            try (FileInputStream fis = new FileInputStream(new File(Environment.getExternalStorageDirectory().getAbsolutePath(),"keyStoreName"))) {
                ks.load(fis, password);
            }
            ks.deleteEntry(alias);
        } catch (KeyStoreException e) {
            e.printStackTrace();
        } catch (FileNotFoundException e) {
            e.printStackTrace();
        } catch (IOException e) {
            e.printStackTrace();
        } catch (CertificateException e) {
            e.printStackTrace();
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        }
    }
    @ReactMethod
    public void makeToast(String message) {
        Toast.makeText(getReactApplicationContext(), message, Toast.LENGTH_SHORT).show();
    }
    /**
     * Returns a salted PBKDF2 hash of the password.
     *
     * @param   password    the password to hash
     * @return              a salted PBKDF2 hash of the password
     */
    @ReactMethod
    public static void generatePasswordKey(String password, String baseSalt, int iterations, int keySize, Promise promise)
    {
        String baseHash = "";
        try {
            char[] pseudoPassword = password.toCharArray();
            byte[] salt = Base64.decode(baseSalt, Base64.NO_WRAP);
            // Hash the password
            PBEKeySpec spec = new PBEKeySpec(pseudoPassword, salt, iterations, keySize * 8);
            SecretKeyFactory skf = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM);
            byte[] hash = skf.generateSecret(spec).getEncoded();
            // format iterations:salt:hash
            baseHash = Base64.encodeToString(hash, Base64.NO_WRAP);
        } catch(NoSuchAlgorithmException | InvalidKeySpecException e) {
            e.printStackTrace();
        } finally {
            promise.resolve(baseHash);
        }
    }
    @ReactMethod
    public void generateKey(Promise promise) {

        String encodedKey = "";
        try {
            SecureRandom secureRandom = new SecureRandom();
            KeyGenerator keyGenerator = KeyGenerator.getInstance(KEY_SPEC_ALGORITHM);
            keyGenerator.init(OUTPUT_KEY_LENGTH, secureRandom);
            SecretKey secretKey = keyGenerator.generateKey();
            encodedKey = android.util.Base64.encodeToString(secretKey.getEncoded(), android.util.Base64.NO_WRAP);
        } catch(NoSuchAlgorithmException exception) {
            exception.printStackTrace();

        }finally {
            promise.resolve(encodedKey);
        }
    }
    @ReactMethod
    public void generateIv(Promise promise) {

        String encodedIv = "";
        try {
            SecureRandom secureRandom = new SecureRandom();
            KeyGenerator keyGenerator = KeyGenerator.getInstance(KEY_SPEC_ALGORITHM);
            keyGenerator.init(OUTPUT_IV_LENGTH, secureRandom);
            SecretKey secretKey = keyGenerator.generateKey();
            encodedIv = android.util.Base64.encodeToString(secretKey.getEncoded(), android.util.Base64.NO_WRAP);
        } catch(NoSuchAlgorithmException exception) {
            exception.printStackTrace();

        }finally {
            promise.resolve(encodedIv);
        }
    }

    //Function to encrypt file
    @ReactMethod
    public void encrypt(String baseData, String baseKey, String baseIv, Promise promise)  {
        String hash = "";
        byte[] data = Base64.decode(baseData, Base64.NO_WRAP);
        byte[] key = Base64.decode(baseKey, Base64.NO_WRAP);
        byte[] iv = Base64.decode(baseIv, Base64.NO_WRAP);
        try {
            SecretKeySpec secretKeySpec = new SecretKeySpec(key, 0, key.length, KEY_SPEC_ALGORITHM);
            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM); // creating java cipher instance
            IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);
            cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, ivParameterSpec); //Initializing the Cipher
            byte[] byteHash = cipher.doFinal(data);
            hash = Base64.encodeToString(byteHash, Base64.NO_WRAP);
        }catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (InvalidAlgorithmParameterException e) {
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        } finally{
            promise.resolve(hash);
        }
    }
    @ReactMethod
    public void decrypt ( String baseHash, String baseKey, String baseIv, Promise promise) {
        byte[] hash = Base64.decode(baseHash, Base64.NO_WRAP);
        byte[] key = Base64.decode(baseKey, Base64.NO_WRAP);
        byte[] iv = Base64.decode(baseIv, Base64.NO_WRAP);
        String data = "";
        try {
            //call cipher function accroding the alogrithm
            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM, PROVIDER);

            SecretKeySpec secretKeySpec = new SecretKeySpec(key, 0, key.length, KEY_SPEC_ALGORITHM);
            //IV parameter
            IvParameterSpec ivParameterSpec = new IvParameterSpec(iv);
            cipher.init(Cipher.DECRYPT_MODE, secretKeySpec, ivParameterSpec);
            byte[] byteData = cipher.doFinal(hash);
            data = Base64.encodeToString(byteData, Base64.NO_WRAP);
        } catch (NoSuchAlgorithmException e) {
            e.printStackTrace();
        } catch (BadPaddingException e) {
            e.printStackTrace();
        } catch (InvalidKeyException e) {
            e.printStackTrace();
        } catch (InvalidAlgorithmParameterException e) {
            e.printStackTrace();
        } catch (NoSuchPaddingException e) {
            e.printStackTrace();
        } catch (NoSuchProviderException e) {
            e.printStackTrace();
        } catch (IllegalBlockSizeException e) {
            e.printStackTrace();
        } finally {
            promise.resolve(data);
        }
    }

//    /**
//     * Converts a string of hexadecimal characters into a byte array.
//     *
//     * @param   hex         the hex string
//     * @return              the hex string decoded into a byte array
//     */
//    private static byte[] fromHex(String hex)
//    {
//        byte[] binary = new byte[hex.length() / 2];
//        for(int i = 0; i < binary.length; i++)
//        {
//            binary[i] = (byte)Integer.parseInt(hex.substring(2*i, 2*i+2), 16);
//        }
//        new SecretKeyFactory().getInstance("AES").generateSecret()
//        return binary;
//    }
//    /**
//     * Converts a byte array into a hexadecimal string.
//     *
//     * @param   array       the byte array to convert
//     * @return              a length*2 character string encoding the byte array
//     */
//    private static String toHex(byte[] array)
//    {
//        BigInteger bi = new BigInteger(1, array);
//        String hex = bi.toString(16);
//        int paddingLength = (array.length * 2) - hex.length();
//        if(paddingLength > 0)
//            return String.format("%0" + paddingLength + "d", 0) + hex;
//        else
//            return hex;
//    }
//    /**
//     * Compares two byte arrays in length-constant time. This comparison method
//     * is used so that password hashes cannot be extracted from an on-line
//     * system using a timing attack and then attacked off-line.
//     *
//     * @param   a       the first byte array
//     * @param   b       the second byte array
//     * @return          true if both byte arrays are the same, false if not
//     */
//    private static boolean slowEquals(byte[] a, byte[] b)
//    {
//        int diff = a.length ^ b.length;
//        for(int i = 0; i < a.length && i < b.length; i++)
//            diff |= a[i] ^ b[i];
//        return diff == 0;
//    }



//
//
//    /**
//     * Validates a password using a hash.
//     *
//     * @param   password    the password to check
//     * @param   goodHash    the hash of the valid password
//     * @return              true if the password is correct, false if not
//     */
//    public static boolean validatePassword(String password, String goodHash)
//            throws NoSuchAlgorithmException, InvalidKeySpecException
//    {
//        return validatePassword(password.toCharArray(), goodHash);
//    }
//
//    /**
//     * Validates a password using a hash.
//     *
//     * @param   password    the password to check
//     * @param   goodHash    the hash of the valid password
//     * @return              true if the password is correct, false if not
//     */
//    public static boolean validatePassword(char[] password, String goodHash)
//            throws NoSuchAlgorithmException, InvalidKeySpecException
//    {
//        // Decode the hash into its parameters
//        String[] params = goodHash.split(":");
//        int iterations = Integer.parseInt(params[ITERATION_INDEX]);
//        byte[] salt = fromHex(params[SALT_INDEX]);
//        byte[] hash = fromHex(params[PBKDF2_INDEX]);
//        // Compute the hash of the provided password, using the same salt,
//        // iteration count, and hash length
//        byte[] testHash = pbkdf2(password, salt, iterations, hash.length);
//        // Compare the hashes in constant time. The password is correct if
//        // both hashes match.
//        return slowEquals(hash, testHash);
//    }
//
//    private static byte[] pbkdf2(char[] password, byte[] salt, int iterations, int bytes)
//            throws NoSuchAlgorithmException, InvalidKeySpecException
//    {
//        PBEKeySpec spec = new PBEKeySpec(password, salt, iterations, bytes * 8);
//        SecretKeyFactory skf = SecretKeyFactory.getInstance(PBKDF2_ALGORITHM);
//        return skf.generateSecret(spec).getEncoded();
//    }
//    public byte[] encryptData(byte[] input,Key key) {
//        byte[] output = null;
//        try {
//            Cipher c = Cipher.getInstance("DES/CBC/PKCS5Padding");
//            c.wrap(key);
//            output = c.doFinal(input);
//        } catch (NoSuchPaddingException e) {
//            e.printStackTrace();
//        } catch (NoSuchAlgorithmException e) {
//            e.printStackTrace();
//        } catch (InvalidKeyException e) {
//            e.printStackTrace();
//        } catch (IllegalBlockSizeException e) {
//            e.printStackTrace();
//        } catch (BadPaddingException e) {
//            e.printStackTrace();
//        } finally {
//            return output;
//        }
//    }
//
//    //Function to encrypt file
//    public byte[] encrypt(byte[] data) throws Exception {
//
//        byte[] data = getSecretKey().getEncoded();
//        SecretKeySpec secretKeySpec = new SecretKeySpec(data, 0, data.length, KEY_SPEC_ALGORITHM);
//        Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM); // creating java cipher instance
//
//        cipher.init(Cipher.ENCRYPT_MODE, secretKeySpec, new IvParameterSpec(new byte[cipher.getBlockSize()])); //Initializing the Cipher
//
//        return cipher.doFinal(fileData);
//    }
//
//    public byte[] decode ( byte[] fileData) {
//
//        //call the file in the bite array
//        byte[] decrypted = null;
//        try {
//            //call cipher function accroding the alogrithm
//            Cipher cipher = Cipher.getInstance(CIPHER_ALGORITHM, PROVIDER);
//            //IV parameter
//            IvParameterSpec ivParameterSpec = new IvParameterSpec(new byte[cipher.getBlockSize()]);
//            cipher.init(Cipher.DECRYPT_MODE, getSecretKey(), ivParameterSpec);
//            decrypted = cipher.doFinal(fileData);
//        } catch(Exception e) {
//            Log.d("webrtc", e.getMessage());
//        }
//        return decrypted;
//    }
//
//    private static SecretKey getSecretKey () throws NoSuchAlgorithmException {
//
//        String encodedKey = getKey();
//        // If no key found, Generate a new one
//        if (null == encodedKey || encodedKey.isEmpty()) {
//            SecureRandom secureRandom = new SecureRandom();
//            KeyGenerator keyGenerator = KeyGenerator.getInstance(KEY_SPEC_ALGORITHM);
//            keyGenerator.init(OUTPUT_KEY_LENGTH, secureRandom);
//            SecretKey secretKey = keyGenerator.generateKey();
//            saveKey(android.util.Base64.encodeToString(secretKey.getEncoded(), android.util.Base64.NO_WRAP));
//
//            return secretKey;
//        }
//
//        byte[] decodedKey = android.util.Base64.decode(encodedKey, Base64.NO_WRAP);
//        SecretKey originalKey = new SecretKeySpec(decodedKey, 0, decodedKey.length, KEY_SPEC_ALGORITHM);
//        return originalKey;
//    }

    @NonNull
    @Override
    public String getName() {
        return "KeyStoreModule";
    }
}