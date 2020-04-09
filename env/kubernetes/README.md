## Kubernetes環境建置


##### Kubernetes 建置步驟
1. create secrets
```
kubectl create secret docker-registry chat-secret-docker-1400404  \
      --docker-server=https://a502dh.systex.com \
      --docker-username=1400404 \
      --docker-password=xxx \
      --docker-email=eric.lee@systex.com \
      --namespace=chat
kubectl create secret generic chat-secret-tls \
      --from-file=tls.key \
      --from-file=tls.crt \
      -n chat
kubectl create secret generic chat-secret-cifs \
      --from-literal="username=chat" \
      --from-literal="password=xxx" \
      --from-literal="domain=." \
      --type=fvigotti/cifs \
      --namespace=chat
```
2. create volume dirs on file-server
3. create kubernetes services
```
kubectl create -f chat-mongo.yaml
kubectl create -f chat-webapp.yaml
```
4. create kubernetes ingress
```
kubectl create -f chat-ingress.yaml
```
5. check it, done.
```
kubectl get all -n chat -o wide
```



