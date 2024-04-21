export const filterPosts =(allPosts, search )=> {
    const keywords = [];
    const tags = [];

    // Split the search string into words
    const words = search.split(" ");

    // Classify words into keywords and tags
    words.forEach(word => {
        if (word.startsWith("[") && word.endsWith("]")) {
            // Extract the tag, remove the surrounding brackets
            const tag = word.substring(1, word.length - 1);
            tags.push(tag.toLowerCase());  // Convert tag to lowercase for case-insensitive matching
        } else {
            // Add the word to keywords
            keywords.push(word.toLowerCase());  // Convert keyword to lowercase for case-insensitive matching
        }
    });

    // Filter the posts based on the classified words
    return allPosts.filter(post => {
        const postTitle = post.title.toLowerCase(); // Convert post title to lowercase once
        const postText = post.text.toLowerCase(); // Convert post text to lowercase once

        // Check for keyword match in title or text
        const matchesKeywords = keywords.some(keyword => 
            postTitle.includes(keyword) || postText.includes(keyword));

        // Check for tag match
        const matchesTags = tags.some(tag => post.tags.map(t => t.toLowerCase()).includes(tag));

        // Return posts that match any keyword or tag
        return matchesKeywords || matchesTags;
    });
}


export const validateSignup = (email, password, confirmPassword, username) => {
    // Check if email is valid
    if (!email || !email.includes('@') || !email.includes('.')) {
        return 'Invalid email';
    }

    // Check if password is valid
    if (!password) {
        return 'Password is required';
    }

    // Check if password and confirm password match
    if (password !== confirmPassword) {
        return 'Passwords do not match';
    }

    // Check if username is valid
    if (!username || username.length < 3) {
        return 'Username must be at least 3 characters';
    }

    return null;
}