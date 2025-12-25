function freq(s){
const map={};
for(let ch of s){
  map[ch]=(map[ch]??0)+1;
}
return map;
}

class Node{
  constructor(char,freq,left=null,right=null){
    this.char=char;
    this.freq=freq;
    this.left=left;
    this.right=right;
  }
}

class MinHeap{
  constructor(){
    this.heap=[];
  }

insert(node){
  this.heap.push(node);
  this.bubbleUp();
}



  bubbleUp() {
    let index = this.heap.length - 1;

    while (index > 0) {
      let parentIndex = Math.floor((index - 1) / 2);

      if (this.heap[parentIndex].freq <= this.heap[index].freq) break;

      [this.heap[parentIndex], this.heap[index]] =
        [this.heap[index], this.heap[parentIndex]];

      index = parentIndex;
    }
  }



   extractMin(){
    if(this.heap.length===1)
      return this.heap.pop();
    const min=this.heap[0];
    this.heap[0]=this.heap.pop();
    this.bubbleDown();
    return min;
   }



   bubbleDown(){
    let index=0;
    const length=this.heap.length;
    while(true){
      let left=2*index+1;
      let right=2*index+2;
      let smallest=index;
if(left<length&&this.heap[left].freq<this.heap[smallest].freq){
  smallest=left;
}
if(right<length&&this.heap[right].freq<this.heap[smallest].freq)
  smallest=right;
if(smallest===index)
  break;
  
[this.heap[index],this.heap[smallest]]=[this.heap[smallest],this.heap[index]];


index=smallest
 }
}
}

function huffmannTree(freqMap){
  const heap=new MinHeap();
  for(let ch in freqMap){
    heap.insert(new Node (ch,freqMap[ch]));
  }
while(heap.heap.length>1)
{
  const left=heap.extractMin();
  const right=heap.extractMin();
  const parent =new Node(null,left.freq+right.freq,left,right)
  heap.insert(parent);

}


return heap.extractMin();
}

function generateCodes(root,code="",map={}){
  if(!root)
    return map;
  if(root.char!=null){
    map[root.char]=code;
  }
  generateCodes(root.left,code+"0",map);
  generateCodes(root.right,code+"1",map);
  return map;
}

function encodeText(text,codes)

{
  let encoded="";
  for(let ch of text){
    encoded+=codes[ch];
  }

  return encoded;
}

document.getElementById("combtn").addEventListener("click",()=>{
  const fileInput=document.getElementById("fileInput");
  const file=fileInput.files[0];

if(!file){
  alert("Please select a file");
  return;
}
const reader=new FileReader();

reader.onload=()=>{

  const text=reader.result;
  const freqMap=freq(text);
  const root=huffmannTree(freqMap);
  const codes=generateCodes(root);
  const encoded=encodeText(text,codes);

const compressedData={
  codes:codes,
  encoded:encoded
};
const blob=new Blob(
  [JSON.stringify(compressedData)],
{type:"application/json"}
);

const url=URL.createObjectURL(blob);
const a=document.createElement("a");
a.href=url;
a.download="compressed.pm";
a.click();
document.getElementById("output").textContent =
  "Original size: " + text.length + " chars\n" +
  "Compressed size: " + encoded.length + " bits\n\n" +
  "Codes:\n" + JSON.stringify(codes, null, 2);
};

reader.readAsText(file);
});










