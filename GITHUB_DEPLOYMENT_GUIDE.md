# 🚀 Complete GitHub Deployment Guide for Your Portfolio

## 📋 Step-by-Step Instructions

### Step 1: Prepare Your Files

1. **Add your profile photo:**
   - Create a folder named `assets` in your resume directory
   - Add your profile photo as `profile-photo.jpg` (recommended size: 400x400px or square)
   - Supported formats: JPG, PNG, WebP
   - Make sure the image is professional and high-quality

2. **File structure should look like this:**
   ```
   resume/
   ├── index.html
   ├── styles.css
   ├── script.js
   ├── README.md
   ├── package.json
   ├── .github/
   │   └── workflows/
   │       └── deploy.yml
   ├── assets/
   │   └── profile-photo.jpg
   └── resume_updated_.txt
   ```

### Step 2: Create GitHub Repository

1. **Go to GitHub.com** and sign in to your account
2. **Click the "+" icon** in the top right corner
3. **Select "New repository"**
4. **Repository settings:**
   - Repository name: `resume` (or `portfolio`, `akash-portfolio`)
   - Description: "Professional Portfolio - ELT Developer & Python Developer"
   - Set to **Public** (required for free GitHub Pages)
   - **Don't** initialize with README (we already have files)
5. **Click "Create repository"**

### Step 3: Upload Files to GitHub

#### Option A: Using GitHub Web Interface (Easiest)

1. **Go to your new repository page**
2. **Click "uploading an existing file"**
3. **Drag and drop all your files** (index.html, styles.css, script.js, etc.)
4. **Create the assets folder:**
   - Click "Create new file"
   - Type `assets/profile-photo.jpg`
   - Upload your image
5. **Commit changes:**
   - Add commit message: "Initial portfolio upload"
   - Click "Commit changes"

#### Option B: Using Git Command Line (Advanced)

1. **Open terminal/command prompt in your resume folder**
2. **Run these commands:**
   ```bash
   git init
   git add .
   git commit -m "Initial portfolio upload"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/resume.git
   git push -u origin main
   ```

### Step 4: Enable GitHub Pages

1. **Go to your repository on GitHub**
2. **Click on "Settings" tab** (top right of repository)
3. **Scroll down to "Pages" section** (left sidebar)
4. **Under "Source":**
   - Select "Deploy from a branch"
   - Branch: `main`
   - Folder: `/ (root)`
5. **Click "Save"**
6. **Wait 2-5 minutes** for deployment

### Step 5: Get Your Live URL

1. **After deployment, your portfolio will be live at:**
   ```
   https://YOUR_USERNAME.github.io/resume
   ```
2. **Example:** `https://akashaku.github.io/resume`
3. **Bookmark this URL** - this is your professional portfolio link!

### Step 6: Update Your Resume with the Link

Add this section to your resume:

```markdown
## 🌐 Portfolio
**Live Portfolio:** https://YOUR_USERNAME.github.io/resume
- Interactive web portfolio showcasing technical skills and projects
- Responsive design optimized for all devices
- Real-time demonstrations of ELT/ETL capabilities
```

## 🔧 Troubleshooting

### If GitHub Pages doesn't work:

1. **Check repository is public**
2. **Verify all files are uploaded correctly**
3. **Wait 5-10 minutes for deployment**
4. **Check the Actions tab for deployment status**

### If image doesn't show:

1. **Verify image is in `assets/profile-photo.jpg`**
2. **Check image file size (should be under 5MB)**
3. **Try different image formats (JPG, PNG)**
4. **Clear browser cache and refresh**

### If styling looks broken:

1. **Check all files are in the root directory**
2. **Verify file names match exactly (case-sensitive)**
3. **Check browser console for errors**

## 📱 Testing Your Portfolio

1. **Test on different devices:**
   - Desktop computer
   - Mobile phone
   - Tablet
2. **Test all sections:**
   - Navigation works
   - Contact form functions
   - All links work
   - Images load properly

## 🎯 Customization Options

### Change Repository Name:
- Go to repository Settings → General
- Change repository name
- Update your portfolio URL accordingly

### Add Custom Domain:
- Go to repository Settings → Pages
- Add custom domain in "Custom domain" field
- Follow GitHub's instructions for DNS setup

### Update Content:
- Edit files directly on GitHub or locally
- Push changes to automatically update live site
- Changes appear within 2-5 minutes

## 📊 Analytics (Optional)

Add Google Analytics to track visitors:

1. **Get Google Analytics tracking code**
2. **Add to `index.html` before `</head>`:**
   ```html
   <!-- Google Analytics -->
   <script async src="https://www.googletagmanager.com/gtag/js?id=GA_TRACKING_ID"></script>
   <script>
     window.dataLayer = window.dataLayer || [];
     function gtag(){dataLayer.push(arguments);}
     gtag('js', new Date());
     gtag('config', 'GA_TRACKING_ID');
   </script>
   ```

## 🚀 Next Steps

1. **Share your portfolio link** on:
   - LinkedIn profile
   - Resume/CV
   - Email signatures
   - Business cards
   - Job applications

2. **Keep it updated** with:
   - New projects
   - Updated skills
   - Recent achievements
   - New certifications

3. **Get feedback** from:
   - Colleagues
   - Mentors
   - Professional network

## 📞 Support

If you encounter any issues:
1. Check GitHub's documentation
2. Search for solutions on Stack Overflow
3. Ask in GitHub community forums

---

**Your professional portfolio will be live and ready to impress employers! 🎉**
