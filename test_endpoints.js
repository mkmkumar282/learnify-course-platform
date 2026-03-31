// test_endpoints.js
const assert = require('assert');

const BASE_URL = 'http://localhost:3000';

// Helpers to format console outputs
const logPass = (msg) => console.log('✅ ' + msg);
const logFail = (msg, err) => console.error('❌ ' + msg, err);

async function wait(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}

async function runTests() {
    console.log("Starting API integration tests...\n");
    
    // Test data
    const timestamp = Date.now();
    const adminData = {
        email: `admin_${timestamp}@test.com`,
        password: "securepassword123",
        firstName: "Admin",
        lastName: "User"
    };
    
    const userData = {
        email: `user_${timestamp}@test.com`,
        password: "securepassword123",
        firstName: "Test",
        lastName: "User"
    };

    let adminToken = '';
    let userToken = '';
    let courseId = '';

    try {
        // --- 1. Admin Actions ---
        console.log("--- Testing Admin Endpoints ---");
        
        // Admin Signup
        const adminSignupRes = await fetch(`${BASE_URL}/admin/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(adminData)
        });
        const adminSignupParsed = await adminSignupRes.json();
        assert(adminSignupRes.ok, "Admin signup failed: " + JSON.stringify(adminSignupParsed));
        logPass("Admin Signup successful");

        // Admin Signin
        const adminSigninRes = await fetch(`${BASE_URL}/admin/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: adminData.email, password: adminData.password })
        });
        const adminSigninParsed = await adminSigninRes.json();
        assert(adminSigninRes.ok && adminSigninParsed.token, "Admin signin failed: " + JSON.stringify(adminSigninParsed));
        adminToken = adminSigninParsed.token;
        logPass("Admin Signin successful");

        // Admin Create Course
        const courseData = {
            title: "Full Stack Mastery " + timestamp,
            description: "Learn to build modern web apps.",
            price: 99.99,
            imageUrl: "https://example.com/image.png"
        };
        const createCourseRes = await fetch(`${BASE_URL}/admin/course`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'token': adminToken
            },
            body: JSON.stringify(courseData)
        });
        const createCourseParsed = await createCourseRes.json();
        assert(createCourseRes.ok && createCourseParsed.courseId, "Admin create course failed: " + JSON.stringify(createCourseParsed));
        courseId = createCourseParsed.courseId;
        logPass("Admin Create Course successful");
        
        // Admin Get Courses (Bulk)
        const getCoursesRes = await fetch(`${BASE_URL}/admin/course/bulk`, {
            method: 'POST', // The route is defined as POST in the codebase
            headers: { 
                'Content-Type': 'application/json',
                'token': adminToken
            }
        });
        const getCoursesParsed = await getCoursesRes.json();
        assert(getCoursesRes.ok && Array.isArray(getCoursesParsed.courses), "Admin bulk course GET failed: " + JSON.stringify(getCoursesParsed));
        logPass("Admin Get Courses (bulk) successful");


        // --- 2. Public / Course Actions ---
        console.log("\n--- Testing Public Course Endpoints ---");
        
        // Get Preview
        const previewRes = await fetch(`${BASE_URL}/course/preview`, { method: 'GET' });
        const previewParsed = await previewRes.json();
        assert(previewRes.ok && Array.isArray(previewParsed.courses), "Course preview GET failed: " + JSON.stringify(previewParsed));
        logPass("Course Preview successful, found " + previewParsed.courses.length + " course(s)");


        // --- 3. User Actions ---
        console.log("\n--- Testing User Endpoints ---");

        // User Signup
        const userSignupRes = await fetch(`${BASE_URL}/user/signup`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(userData)
        });
        const userSignupParsed = await userSignupRes.json();
        assert(userSignupRes.ok, "User signup failed: " + JSON.stringify(userSignupParsed));
        logPass("User Signup successful");

        // User Signin
        const userSigninRes = await fetch(`${BASE_URL}/user/signin`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email: userData.email, password: userData.password })
        });
        const userSigninParsed = await userSigninRes.json();
        assert(userSigninRes.ok && userSigninParsed.token, "User signin failed: " + JSON.stringify(userSigninParsed));
        userToken = userSigninParsed.token;
        logPass("User Signin successful");

        // User Purchase Course
        const purchaseCourseRes = await fetch(`${BASE_URL}/course/purchase`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'token': userToken 
            },
            body: JSON.stringify({ courseId })
        });
        const purchaseCourseParsed = await purchaseCourseRes.json();
        assert(purchaseCourseRes.ok, "User purchase course failed: " + JSON.stringify(purchaseCourseParsed));
        logPass("User Purchase Course successful");
        
        // User Duplicate Purchase Course (Expect Failure)
        const purchaseCourseResDuplicate = await fetch(`${BASE_URL}/course/purchase`, {
            method: 'POST',
            headers: { 
                'Content-Type': 'application/json',
                'token': userToken 
            },
            body: JSON.stringify({ courseId })
        });
        assert(purchaseCourseResDuplicate.status === 400, "User duplicate purchase should have failed with 400 status");
        logPass("User Duplicate Purchase Course cleanly failed (Expected behavior)");

        // User Get Purchases
        const getPurchasesRes = await fetch(`${BASE_URL}/user/purchases`, {
            method: 'GET',
            headers: { 
                'Content-Type': 'application/json',
                'token': userToken 
            }
        });
        const getPurchasesParsed = await getPurchasesRes.json();
        assert(getPurchasesRes.ok && Array.isArray(getPurchasesParsed.purchases), "User get purchases failed: " + JSON.stringify(getPurchasesParsed));
        logPass("User Get Purchases successful, found " + getPurchasesParsed.purchases.length + " purchase(s)");

        console.log("\n🎉 ALL TESTS PASSED!");
    } catch (err) {
        logFail("Test failed", err);
        process.exit(1);
    }
}

runTests();
