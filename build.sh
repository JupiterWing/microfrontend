export NVM_DIR="/var/lib/jenkins/.nvm"
. $NVM_DIR/nvm.sh
nvm install 21.0.0

# Force the install of pnpm
echo "================ INSTALLING PNPM ================"
npm install -g pnpm

echo "============ INSTALLING DEPENDENCIES ============"
pnpm install --no-frozen-lockfile
install_exit_code=$?
if [ $install_exit_code -ne 0 ]; then
    echo -e "FATAL ERROR! Failed to install dependencies. Exiting..."
    exit $install_exit_code
else
    echo -e "Dependencies installed without errors. Continuing..."
fi


echo "============ LINTING ============"
pnpm lint
install_exit_code=$?
if [ $install_exit_code -ne 0 ]; then
    echo -e "FATAL ERROR! Failed to run eslint. Exiting..."
    exit $install_exit_code
else
    echo -e "eslint ran without errors. Continuing..."
fi

echo "============ Prettier ============"
pnpm format
install_exit_code=$?
if [ $install_exit_code -ne 0 ]; then
    echo -e "FATAL ERROR! Failed to run prettier. Exiting..."
    exit $install_exit_code
else
    echo -e "prettier ran without errors. Continuing..."
fi

echo "================= RUNNING TESTS ================="
pnpm run test:all
test_exit_code=$?
if [ $test_exit_code -ne 0 ]; then
    echo -e "FATAL ERROR! Tests failed. Exiting..."
    exit $test_exit_code
else
    echo -e "Tests passed without errors. Continuing..."
fi
