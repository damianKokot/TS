for v1 in 0 1 2 3 4
do

for v2 in .7 .8 .9 .95
do

cat > in <<EOF
$v1
30
50
10000
30000
0.001
100000000
$v2
EOF
/usr/bin/python3.7 /home/dam/Dokumenty/Labs/TS/Lista2/GraphMaker.py <in
/usr/bin/python3.7 /home/dam/Dokumenty/Labs/TS/Lista2/Tester.py <in

done
done

