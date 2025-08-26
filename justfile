JS_RUN := "npx tsx"

# list the defined tasks
default:
    just list

# build the documentation
build: lenskit-packages torch-packages static-files

# index LensKit packages
lenskit-packages:
    {{JS_RUN}} lenskit-packages.ts

# index Pytorch packages
torch-packages:
    {{JS_RUN}} torch-packages.ts

# index static packages
static-files:
    cp -rf static/* out/

