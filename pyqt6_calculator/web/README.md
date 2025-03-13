# ICC Calculator Web Version

## Deployment Steps

1. Create a GitHub repository named `icc-calculator`

2. Update `deploy.bat` with your GitHub username:
   ```batch
   git remote add origin https://github.com/[YOUR-USERNAME]/icc-calculator.git
   ```

3. Run deployment:
   ```bash
   deploy.bat
   ```

4. Enable GitHub Pages:
   - Go to repository Settings
   - Navigate to Pages
   - Select `gh-pages` branch
   - Save

The calculator will be available at:
`https://[YOUR-USERNAME].github.io/icc-calculator/`

## Local Testing
```bash
python -m http.server 8000
```
Then visit `http://localhost:8000`
