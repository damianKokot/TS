echo "INTENSITY" > OUT

for v1 in $(seq 0 30 180)
do

cat > in <<EOF
0
$v1
`expr $v1 + 30`
10000
10000
0.001
100000000
.86
EOF

echo $v1 `expr $v1 + 30` >> OUT
/usr/bin/python3.7 /home/dam/Dokumenty/Labs/TS/Lista2/GraphMaker.py <in
/usr/bin/python3.7 /home/dam/Dokumenty/Labs/TS/Lista2/Tester.py <in >>OUT
done


echo "" >> OUT
echo "SPEED" >> OUT

for v1 in $(seq 25000000 25000000 150000000)
do

echo "$v1" >> OUT
cat > in <<EOF
0
30
50
1000
10000
0.001
$v1
.86
EOF
/usr/bin/python3.7 /home/dam/Dokumenty/Labs/TS/Lista2/Tester.py <in >>OUT
done

echo "" >> OUT
echo "STRUCTURE" >> OUT
for v1 in 0 1 2 3 4
do

echo "" >>OUT
echo "$v1" >>OUT

/usr/bin/python3.7 /home/dam/Dokumenty/Labs/TS/Lista2/GraphMaker.py <in
for v2 in .7 .8 .9 .95
do

cat > in <<EOF
$v1
30
50
10000
5000
0.001
100000000
$v2
EOF
/usr/bin/python3.7 /home/dam/Dokumenty/Labs/TS/Lista2/Tester.py <in >> OUT
done
done

