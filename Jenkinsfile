pipeline {
  agent any
  stages {
    stage('build') {
      steps {
        sh '''yarn install
yarn build-prod'''
      }
    }

    stage('deploy') {
      steps {
        sh '''echo ">>> sync package to node.."

rsync -av -e "ssh -o StrictHostKeyChecking=no" dist/ root@10.3.230.122:/data/opsweb/dist/

test $? == 0 && echo -e "\\\\n\\\\t### deploy success ###"'''
      }
    }

  }
}