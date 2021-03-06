# Déploiement de l'application sur le serveur AWS

Dans les fichiers `ansible/inventory/group_vars/madu.yml` et `ansible/inventory/inventory`, remplacer `insert_ip` par l'ip obtenu dans lors de la création du serveur AWS avec Terraform.

---

## Roles

- common: Installation de python qui permet d'utiliser les rôles suivants.
- geerlingguy.docker: Installation de docker et docker-compose permettant de déployer l'application sur le serveur.
- madu: Installation de l'application:
  - copie des dossiers api et back-office
  - copie de docker-compose pour déployer la base de données mongo, l'api et le back-office
  - arret des containers docker pour éviter des crash lors des builds
  - création de l'image docker de l'api en node
  - création de l'image docker du back-office servi avec nginx
  - lancement du docker-compose
- madu-insert: Ajout d'un utilisateur super administrateur dans la base de donnée
---

## Mise en place du serveur

Remplacer les `{value}` dans les commandes suivantes avant de les executer.

Installation de l'application sur le serveur AWS:
```sh
ansible-playbook -i inventory/ec2.py -i inventory/hosts playbook.yml --private-key ~/.ssh/id_rsa -u ubuntu  --ask-vault-pass
```

Mise à jour de l'application:
```sh
ansible-playbook -i inventory/ec2.py -i inventory/hosts playbook.yml --private-key ~/.ssh/id_rsa -u ubuntu -t deploy  --ask-vault-pass
```

Insérer un utilisateur avec le rôle super administrateur:
```sh
ansible-playbook -i inventory/ec2.py playbook-insert.yml --private-key ~/.ssh/id_rsa -u ubuntu -e user_firstName={firstname} -e user_lastName={lastname} -e user_email={email} -e user_password={password}
```

---

Insérer fixtures (vide puis remplit la base de données):
```sh
ansible-playbook -i inventory/ec2.py playbook-fixtures.yml --private-key ~/.ssh/id_rsa -u ubuntu
```
