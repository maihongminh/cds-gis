const fs = require('fs');
const path = require('path');

const baseDir = path.resolve('d:/Git/cds-demo/agri-sync/src/app/dashboard');

// 1. Process standard dashboard module pages
const moduleDirs = ['households', 'crops', 'livestock', 'lands', 'household-economy', 'forest-dvmtr', 'reports'];

moduleDirs.forEach(mod => {
  const pagePath = path.join(baseDir, mod, 'page.tsx');
  if (fs.existsSync(pagePath)) {
    let content = fs.readFileSync(pagePath, 'utf8');

    // Remove currentRole from useTenant
    content = content.replace(/const\s*\{\s*([^}]+?),\s*currentRole\s*\}\s*=\s*useTenant\(\);/, 'const { $1 } = useTenant();');
    content = content.replace(/const\s*\{\s*currentRole,\s*([^}]+?)\s*\}\s*=\s*useTenant\(\);/, 'const { $1 } = useTenant();');
    
    // Remove isHamletOfficer definition and initialHamlet scoping
    content = content.replace(/\s*\/\/\s*Scoping checks\s*const\s+isHamletOfficer\s*=\s*currentRole\s*===\s*'hamlet_officer';\s*const\s+initialHamlet\s*=\s*isHamletOfficer\s*\?\s*'noc-03'\s*:\s*selectedHamletCode;/, '\n  const initialHamlet = selectedHamletCode;');
    
    // Clean up useEffect syncing
    content = content.replace(
      /React\.useEffect\(\(\)\s*=>\s*\{\s*if\s*\(!isHamletOfficer\)\s*\{\s*setSelectedHamlet\(selectedHamletCode\);\s*\}\s*\},\s*\[selectedHamletCode,\s*isHamletOfficer\]\);/g,
      `React.useEffect(() => {
    setSelectedHamlet(selectedHamletCode);
  }, [selectedHamletCode]);`
    );

    // Clean up reset handler
    content = content.replace(
      /if\s*\(!isHamletOfficer\)\s*\{\s*setSelectedHamlet\('all'\);\s*\}/g,
      "setSelectedHamlet('all');"
    );
    // useCallback deps replacement
    content = content.replace(/\},\s*\[isHamletOfficer\]\);/g, '}, []);');
    
    // Hamlet filter logic inside useMemo
    content = content.replace(
      /if\s*\(isHamletOfficer\)\s*\{\s*if\s*\(([^.]+?)\.hamletCode\s*!==\s*'noc-03'\)\s*return\s*false;\s*\}\s*else\s*if\s*\(selectedHamlet\s*!==\s*'all'\s*&&\s*\1\.hamletCode\s*!==\s*selectedHamlet\)\s*\{\s*return\s*false;\s*\}/g,
      `if (selectedHamlet !== 'all' && $1.hamletCode !== selectedHamlet) {
        return false;
      }`
    );

    // Clean up dependencies arrays
    content = content.replace(/,\s*isHamletOfficer\s*\]\);/g, ']);');

    // Replace the word "nóc" in UI text
    content = content.replace(/Thôn\s*\/\s*Nóc/gi, 'Thôn');
    content = content.replace(/Thôn\/Nóc/gi, 'Thôn');
    content = content.replace(/thôn\/nóc/gi, 'thôn');
    content = content.replace(/Nóc\s*\/\s*Bản/gi, 'Thôn');
    content = content.replace(/Nóc /gi, 'Thôn ');
    content = content.replace(/nóc/gi, 'thôn');

    fs.writeFileSync(pagePath, content, 'utf8');
    console.log(`Successfully updated: ${pagePath}`);
  }

  // 2. Process filters components
  const filterFileName = mod === 'household-economy' ? 'economy-filters.tsx' : `${mod}-filters.tsx`;
  const filterPath = path.join(baseDir, mod, 'components', filterFileName);
  
  if (fs.existsSync(filterPath)) {
    let content = fs.readFileSync(filterPath, 'utf8');

    // Remove isHamletOfficer and currentRole in useTenant
    content = content.replace(/const\s*\{\s*([^}]+?),\s*currentRole\s*\}\s*=\s*useTenant\(\);/, 'const { $1 } = useTenant();');
    content = content.replace(/const\s*isHamletOfficer\s*=\s*currentRole\s*===\s*'hamlet_officer';/g, '');

    // Replace (!isHamletOfficer && selectedHamlet !== 'all')
    content = content.replace(/\(!isHamletOfficer\s*&&\s*selectedHamlet\s*!==\s*'all'\)/g, "(selectedHamlet !== 'all')");

    // Remove disabled={isHamletOfficer}
    content = content.replace(/\s*disabled=\{isHamletOfficer\}/g, '');

    // Clean up comments
    content = content.replace(/\/\/ Hamlet Officer is locked to their hamlet/g, '');

    // Replace terms "Nóc"
    content = content.replace(/Lọc theo Nóc\.\.\./g, 'Lọc theo Thôn...');
    content = content.replace(/Tất cả Nóc \/ Thôn/g, 'Tất cả Thôn');
    content = content.replace(/Thôn\s*\/\s*Nóc/gi, 'Thôn');
    content = content.replace(/Thôn\/Nóc/gi, 'Thôn');
    content = content.replace(/thôn\/nóc/gi, 'thôn');
    content = content.replace(/Nóc\s*\/\s*Bản/gi, 'Thôn');
    content = content.replace(/Nóc/g, 'Thôn');
    content = content.replace(/nóc/g, 'thôn');

    fs.writeFileSync(filterPath, content, 'utf8');
    console.log(`Successfully updated filters: ${filterPath}`);
  }
});

// 3. Update users-filters.tsx
const usersFiltersPath = path.join(baseDir, 'users', 'components', 'users-filters.tsx');
if (fs.existsSync(usersFiltersPath)) {
  let content = fs.readFileSync(usersFiltersPath, 'utf8');
  content = content.replace(
    /const USER_ROLES:\s*UserRole\[\]\s*=\s*\[[^\]]+?\];/,
    "const USER_ROLES: UserRole[] = ['admin', 'commune_officer', 'leader'];"
  );
  content = content.replace(/Thôn\/nóc/g, 'Thôn');
  fs.writeFileSync(usersFiltersPath, content, 'utf8');
  console.log('Updated users-filters.tsx');
}

// 4. Update user-form-dialog.tsx
const userFormPath = path.join(baseDir, 'users', 'components', 'user-form-dialog.tsx');
if (fs.existsSync(userFormPath)) {
  let content = fs.readFileSync(userFormPath, 'utf8');
  // Update roles list
  content = content.replace(
    /const USER_ROLES:\s*UserRole\[\]\s*=\s*\[[^\]]+?\];/,
    "const USER_ROLES: UserRole[] = ['admin', 'commune_officer', 'leader'];"
  );
  // Update default role state
  content = content.replace(/useState<UserRole>\('viewer'\)/g, "useState<UserRole>('commune_officer')");
  content = content.replace(/setRole\('viewer'\)/g, "setRole('commune_officer')");
  // Remove hamlet input field completely
  content = content.replace(
    /\{role\s*===\s*'hamlet_officer'\s*&&\s*\(\s*<div[\s\S]+?<\/div>\s*\)\}/g,
    ''
  );
  content = content.replace(/Thôn\/nóc/g, 'Thôn');
  fs.writeFileSync(userFormPath, content, 'utf8');
  console.log('Updated user-form-dialog.tsx');
}

// 5. Update users-table.tsx
const usersTablePath = path.join(baseDir, 'users', 'components', 'users-table.tsx');
if (fs.existsSync(usersTablePath)) {
  let content = fs.readFileSync(usersTablePath, 'utf8');
  
  // Replace SCOPE_LABELS
  content = content.replace(
    /const\s*SCOPE_LABELS:\s*Record<string,\s*string>\s*=\s*\{[\s\S]+?\};/,
    `const SCOPE_LABELS: Record<string, string> = {
  admin: 'Toàn hệ thống',
  commune_officer: 'Toàn xã',
  leader: 'Chỉ xem – Toàn xã',
};`
  );

  // Replace text
  content = content.replace(/Thôn\/nóc/g, 'Thôn');
  content = content.replace(/Thôn \/ Nóc/g, 'Thôn');
  content = content.replace(/thôn\/nóc/g, 'thôn');

  fs.writeFileSync(usersTablePath, content, 'utf8');
  console.log('Updated users-table.tsx');
}

// 6. Update notifications/page.tsx
const notificationsPagePath = path.join(baseDir, 'notifications', 'page.tsx');
if (fs.existsSync(notificationsPagePath)) {
  let content = fs.readFileSync(notificationsPagePath, 'utf8');
  content = content.replace(/Nóc /g, 'Thôn ');
  content = content.replace(/Nóc/g, 'Thôn');
  content = content.replace(/nóc/g, 'thôn');
  fs.writeFileSync(notificationsPagePath, content, 'utf8');
  console.log('Updated notifications/page.tsx');
}

// 7. Update other components: land [id] page, household-economy [id] page, forest-dvmtr [id] page, households-table.tsx
const householdsTablePath = path.join(baseDir, 'households', 'components', 'households-table.tsx');
if (fs.existsSync(householdsTablePath)) {
  let content = fs.readFileSync(householdsTablePath, 'utf8');
  content = content.replace(/Thôn\s*\/\s*Nóc/gi, 'Thôn');
  fs.writeFileSync(householdsTablePath, content, 'utf8');
  console.log('Updated households-table.tsx');
}

const householdsHeaderPath = path.join(baseDir, 'households', 'components', 'households-header.tsx');
if (fs.existsSync(householdsHeaderPath)) {
  let content = fs.readFileSync(householdsHeaderPath, 'utf8');
  content = content.replace(/Thôn\s*\/\s*Nóc/gi, 'Thôn');
  content = content.replace(/Chọn Nóc\.\.\./g, 'Chọn Thôn...');
  fs.writeFileSync(householdsHeaderPath, content, 'utf8');
  console.log('Updated households-header.tsx');
}

const landIdPagePath = path.join(baseDir, 'lands', '[id]', 'page.tsx');
if (fs.existsSync(landIdPagePath)) {
  let content = fs.readFileSync(landIdPagePath, 'utf8');
  content = content.replace(/Thôn\/nóc/g, 'Thôn');
  fs.writeFileSync(landIdPagePath, content, 'utf8');
  console.log('Updated lands/[id]/page.tsx');
}

const econIdPagePath = path.join(baseDir, 'household-economy', '[id]', 'page.tsx');
if (fs.existsSync(econIdPagePath)) {
  let content = fs.readFileSync(econIdPagePath, 'utf8');
  content = content.replace(/Thôn\/nóc/g, 'Thôn');
  fs.writeFileSync(econIdPagePath, content, 'utf8');
  console.log('Updated household-economy/[id]/page.tsx');
}

const forestIdPagePath = path.join(baseDir, 'forest-dvmtr', '[id]', 'page.tsx');
if (fs.existsSync(forestIdPagePath)) {
  let content = fs.readFileSync(forestIdPagePath, 'utf8');
  content = content.replace(/Thôn\/nóc/g, 'Thôn');
  fs.writeFileSync(forestIdPagePath, content, 'utf8');
  console.log('Updated forest-dvmtr/[id]/page.tsx');
}

const catalogsPagePath = path.join(baseDir, 'catalogs', 'page.tsx');
if (fs.existsSync(catalogsPagePath)) {
  let content = fs.readFileSync(catalogsPagePath, 'utf8');
  content = content.replace(/nóc/g, 'thôn');
  fs.writeFileSync(catalogsPagePath, content, 'utf8');
  console.log('Updated catalogs/page.tsx');
}
