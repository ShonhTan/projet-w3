![](./schema-infra.jpg)


Exporter toutes les variables d’environnement
```
set -a && source .env && set +a
```

Encrypter le `.env`
```
ansible-vault encrypt .env --output .env.encrypted --ask-vault-pass
```

Décrypter le `.env.encrypted`
```
ansible-vault decrypt .env.encrypted --output .env --ask-vault-pass
```

<details>

```
// Créer une paire de clé ssh
ssh-keygen -t rsa -b 4096 -f ./id_rsa

// Ajouter les clés ssh au .env
echo "SSH_PUBLIC_KEY=\"$(cat id_rsa.pub)\"" >> ../.env
echo "SSH_PRIVATE_KEY=\"$(cat id_rsa)\"" >> ../.env

// Créer les ressources aws
terraform apply -var=ssh_public_key=${SSH_PUBLIC_KEY}

// Recréer la clé privée depuis la variable d’environnement
echo ${SSH_PRIVATE_KEY} > ./id_rsa
chmod 600 ./id_rsa

// Lancer le playbook ansible pour la première fois
ansible-playbook -i inventory/ec2.py playbook.yml -u ubuntu --key ./id_rsa

// Lancer le playbook pour redéployer
ansible-playbook -i inventory/ec2.py playbook.yml --tags deploy -u ubuntu --key ./id_rsa
// Lancer le playbook pour remplir la base de donnée
ansible-playbook -i inventory/ec2.py playbook-fixtures.yml -u ubuntu --key ./id_rsa

// Construire et pousser les images Docker en local
docker build -t $DOCKER_USERNAME/madu_api:latest ./api
docker push $DOCKER_USERNAME/madu_api:latest
docker build -t $DOCKER_USERNAME/madu_back-office:latest ./back-office
docker push $DOCKER_USERNAME/madu_back-office:latest

// Remplacer les sauts de lignes par le charactère \n
awk -v ORS='\\n' '1' id_rsa >> ../.env
echo "SSH_PRIVATE_KEY=\"$(awk -v ORS='\\\\n' '1' id_rsa)\"" >> ../.env
```

</details>